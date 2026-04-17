"use client";

import { useCallback, useEffect, useMemo, useState, useTransition } from "react";
import {
  Briefcase,
  Import,
  Loader2,
  RefreshCw,
  Search as SearchIcon,
  Shield,
  User as UserIcon,
  Users,
} from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { Badge, type BadgeVariant } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { cn } from "@/lib/utils";
import type { StaffApprovalStatus, UserRole } from "@/lib/types";
import {
  listUsers,
  syncProfilesFromAuth,
  updateUserRole,
  type ManagedUser,
  type UserListFilters,
} from "@/lib/user-admin-actions";

const roleMeta: Record<UserRole, { label: string; variant: BadgeVariant; Icon: typeof UserIcon }> = {
  admin: { label: "Admin", variant: "destructive", Icon: Shield },
  staff: { label: "Staff", variant: "blue", Icon: Briefcase },
  client: { label: "Client", variant: "success", Icon: UserIcon },
};

const statusMeta: Record<StaffApprovalStatus, { label: string; variant: BadgeVariant }> = {
  none: { label: "—", variant: "outline" },
  pending: { label: "Pending", variant: "warning" },
  approved: { label: "Approved", variant: "success" },
  rejected: { label: "Rejected", variant: "destructive" },
};

type RoleFilter = UserRole | "all";

const ROLE_FILTERS: { id: RoleFilter; label: string }[] = [
  { id: "all", label: "All" },
  { id: "admin", label: "Admins" },
  { id: "staff", label: "Staff" },
  { id: "client", label: "Clients" },
];

function formatDate(value: string) {
  try {
    return new Date(value).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  } catch {
    return value;
  }
}

function initials(name: string | null, email: string) {
  const source = (name ?? email ?? "?").trim();
  const parts = source.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "?";
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
}

export default function AdminUserManagement() {
  const { user: currentAuthUser } = useAuth();

  const [rows, setRows] = useState<ManagedUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const [roleFilter, setRoleFilter] = useState<RoleFilter>("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [editing, setEditing] = useState<ManagedUser | null>(null);
  const [pendingRole, setPendingRole] = useState<UserRole>("client");
  const [isSaving, startSaving] = useTransition();
  const [isRefetching, startRefetch] = useTransition();
  const [isSyncing, startSync] = useTransition();
  const [reloadTick, setReloadTick] = useState(0);
  const [syncInfo, setSyncInfo] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const filters: UserListFilters = { role: roleFilter, search };
    listUsers(filters).then((res) => {
      if (cancelled) return;
      if (res.error) {
        setLoadError(res.error);
        setLoading(false);
        return;
      }
      setLoadError(null);
      setRows(res.data ?? []);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [roleFilter, search, reloadTick]);

  const refresh = useCallback(() => {
    setSyncInfo(null);
    startRefetch(() => {
      setReloadTick((n) => n + 1);
    });
  }, []);

  const syncFromAuth = useCallback(() => {
    setSyncInfo(null);
    setActionError(null);
    startSync(async () => {
      const res = await syncProfilesFromAuth();
      if (res.error) {
        setActionError(res.error);
        return;
      }
      setSyncInfo(
        `Synced from Auth: ${res.inserted ?? 0} new profile(s), ${res.updated ?? 0} updated.`,
      );
      setReloadTick((n) => n + 1);
    });
  }, []);

  // Debounce search input.
  useEffect(() => {
    const handle = setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => clearTimeout(handle);
  }, [searchInput]);

  const busy = loading || isRefetching || isSyncing;

  const stats = useMemo(() => {
    const totals = { total: rows.length, admin: 0, staff: 0, client: 0, pending: 0 };
    for (const r of rows) {
      totals[r.role] += 1;
      if (r.staff_approval_status === "pending") totals.pending += 1;
    }
    return totals;
  }, [rows]);

  function openEdit(row: ManagedUser) {
    setActionError(null);
    setEditing(row);
    setPendingRole(row.role);
  }

  function closeEdit() {
    if (isSaving) return;
    setEditing(null);
  }

  function saveRoleChange() {
    if (!editing) return;
    setActionError(null);
    const target = editing;
    const newRole = pendingRole;
    startSaving(async () => {
      const { error } = await updateUserRole(target.id, newRole);
      if (error) {
        setActionError(error);
        return;
      }
      setRows((prev) =>
        prev.map((r) =>
          r.id === target.id
            ? {
                ...r,
                role: newRole,
                staff_approval_status:
                  newRole === "client" ? "none" : "approved",
              }
            : r,
        ),
      );
      setEditing(null);
    });
  }

  const isSelf = (id: string) => currentAuthUser?.id === id;

  return (
    <div className="view-tab custom-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-background p-3 fade-in md:p-6">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-foreground">User management</h3>
          <p className="text-sm text-muted-foreground">
            Browse all accounts and change roles. Only administrators see this page.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={syncFromAuth}
            disabled={busy}
            title="Create missing profile rows and update email / name from Supabase Auth"
          >
            {isSyncing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Import className="mr-2 h-4 w-4" />
            )}
            Sync from Auth
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={busy}
          >
            <RefreshCw className={cn("mr-2 h-4 w-4", (loading || isRefetching) && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {syncInfo ? (
        <p className="mb-4 rounded-md border border-border bg-muted/50 px-4 py-2 text-sm text-foreground">{syncInfo}</p>
      ) : null}

      {/* Stats */}
      <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
        <StatCard label="Total" value={stats.total} icon={Users} gradient="gradient-primary" />
        <StatCard label="Admins" value={stats.admin} icon={Shield} gradient="gradient-danger" />
        <StatCard label="Staff" value={stats.staff} icon={Briefcase} gradient="gradient-info" />
        <StatCard label="Clients" value={stats.client} icon={UserIcon} gradient="gradient-success" />
        <StatCard label="Pending" value={stats.pending} icon={Loader2} gradient="gradient-warning" />
      </div>

      {/* Filters */}
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search by name or email…"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="flex flex-wrap items-center gap-1 rounded-lg border border-border bg-card p-1">
          {ROLE_FILTERS.map((f) => {
            const active = roleFilter === f.id;
            return (
              <Button
                key={f.id}
                type="button"
                variant={active ? "default" : "ghost"}
                size="sm"
                onClick={() => setRoleFilter(f.id)}
                className={cn("h-8 px-3 text-xs", !active && "text-muted-foreground")}
              >
                {f.label}
              </Button>
            );
          })}
        </div>
      </div>

      {actionError ? (
        <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {actionError}
        </p>
      ) : null}

      {/* Table */}
      <Card className="card-shadow flex min-h-0 flex-1 flex-col border-0 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Users</CardTitle>
          <CardDescription>
            Click a user&apos;s role to promote, demote, or change their access level.
          </CardDescription>
        </CardHeader>
        <CardContent className="custom-scroll flex min-h-0 flex-1 flex-col overflow-auto p-6 pt-0">
          {loading && rows.length === 0 ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading users…
            </div>
          ) : loadError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
              {loadError}
            </p>
          ) : rows.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No users match the current filters.</p>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <Table>
                <TableHeader className="refer-table-header">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>User</TableHead>
                    <TableHead className="hidden md:table-cell">Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead className="hidden sm:table-cell">Staff status</TableHead>
                    <TableHead className="hidden lg:table-cell">Joined</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => {
                    const meta = roleMeta[row.role];
                    const status = statusMeta[row.staff_approval_status];
                    const RoleIcon = meta.Icon;
                    const self = isSelf(row.id);
                    return (
                      <TableRow key={row.id} className="transition-colors hover:bg-muted/50">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                              {initials(row.full_name, row.email)}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-foreground">
                                {row.full_name || "—"}
                                {self ? (
                                  <span className="ml-2 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                                    You
                                  </span>
                                ) : null}
                              </p>
                              <p className="truncate text-xs text-muted-foreground md:hidden">{row.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground md:table-cell">
                          <span className="truncate">{row.email}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant={meta.variant} className="gap-1 uppercase">
                            <RoleIcon className="h-3 w-3" />
                            {meta.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <Badge variant={status.variant} className="uppercase">
                            {status.label}
                          </Badge>
                        </TableCell>
                        <TableCell className="hidden text-sm text-muted-foreground lg:table-cell">
                          {formatDate(row.created_at)}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={() => openEdit(row)}
                            disabled={self && row.role === "admin"}
                            title={
                              self && row.role === "admin"
                                ? "You can't demote your own admin account."
                                : "Change role"
                            }
                          >
                            Change role
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Role edit dialog */}
      <Dialog open={editing !== null} onOpenChange={(open) => (open ? null : closeEdit())}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Change user role</DialogTitle>
            <DialogDescription>
              {editing ? (
                <>
                  Update the access level for <span className="font-medium text-foreground">{editing.full_name || editing.email}</span>.
                </>
              ) : null}
            </DialogDescription>
          </DialogHeader>

          {editing ? (
            <div className="space-y-4">
              <div className="rounded-md border border-border bg-muted/40 p-3 text-sm">
                <p className="font-medium text-foreground">{editing.full_name || "—"}</p>
                <p className="text-xs text-muted-foreground">{editing.email}</p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-foreground">Role</label>
                <Select value={pendingRole} onValueChange={(value) => setPendingRole(value as UserRole)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="client">
                      <span className="flex items-center gap-2">
                        <UserIcon className="h-4 w-4" /> Client
                      </span>
                    </SelectItem>
                    <SelectItem value="staff">
                      <span className="flex items-center gap-2">
                        <Briefcase className="h-4 w-4" /> Staff
                      </span>
                    </SelectItem>
                    <SelectItem value="admin">
                      <span className="flex items-center gap-2">
                        <Shield className="h-4 w-4" /> Admin
                      </span>
                    </SelectItem>
                  </SelectContent>
                </Select>
                <p className="mt-2 text-xs text-muted-foreground">
                  {pendingRole === "admin"
                    ? "Admins can manage other users and approve staff requests."
                    : pendingRole === "staff"
                      ? "Staff members get access to the backoffice."
                      : "Clients only access their own portal."}
                </p>
              </div>

              {isSelf(editing.id) && pendingRole !== "admin" ? (
                <p className="rounded-md border border-destructive/30 bg-destructive/10 px-3 py-2 text-xs text-destructive">
                  You cannot demote your own admin account.
                </p>
              ) : null}
            </div>
          ) : null}

          <DialogFooter className="gap-2 sm:gap-2">
            <Button type="button" variant="ghost" onClick={closeEdit} disabled={isSaving}>
              Cancel
            </Button>
            <Button
              type="button"
              onClick={saveRoleChange}
              disabled={
                isSaving ||
                !editing ||
                pendingRole === editing.role ||
                (isSelf(editing.id) && pendingRole !== "admin")
              }
              className="gradient-primary border-0 text-primary-foreground"
            >
              {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Save changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function StatCard({
  label,
  value,
  icon: Icon,
  gradient,
}: {
  label: string;
  value: number;
  icon: typeof UserIcon;
  gradient: "gradient-primary" | "gradient-success" | "gradient-warning" | "gradient-danger" | "gradient-info";
}) {
  return (
    <Card className="card-shadow overflow-hidden border-0">
      <CardContent className="flex items-center gap-3 p-3 sm:gap-4 sm:p-4">
        <div
          className={cn(
            gradient,
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl md:h-12 md:w-12",
          )}
        >
          <Icon className="h-5 w-5 text-primary-foreground md:h-6 md:w-6" />
        </div>
        <div className="min-w-0">
          <p className="truncate text-xs text-muted-foreground md:text-sm">{label}</p>
          <p className="truncate text-lg font-bold text-foreground md:text-2xl">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
