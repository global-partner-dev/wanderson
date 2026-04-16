"use client";

import { useCallback, useEffect, useState, useTransition } from "react";
import { Loader2, UserCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import {
  approveStaffSignup,
  getPendingStaffRequests,
  rejectStaffSignup,
  type PendingStaffRow,
} from "@/lib/staff-admin-actions";

export default function AdminStaffApprovals() {
  const [rows, setRows] = useState<PendingStaffRow[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isPending, startTransition] = useTransition();

  const refresh = useCallback(() => {
    setLoading(true);
    setLoadError(null);
    getPendingStaffRequests().then((res) => {
      setLoading(false);
      if (res.error) {
        setLoadError(res.error);
        return;
      }
      setRows(res.data ?? []);
    });
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  function handleApprove(id: string) {
    setActionError(null);
    startTransition(async () => {
      const { error } = await approveStaffSignup(id);
      if (error) {
        setActionError(error);
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== id));
    });
  }

  function handleReject(id: string) {
    setActionError(null);
    startTransition(async () => {
      const { error } = await rejectStaffSignup(id);
      if (error) {
        setActionError(error);
        return;
      }
      setRows((prev) => prev.filter((r) => r.id !== id));
    });
  }

  return (
    <div className="view-tab custom-scroll flex min-h-0 flex-1 flex-col overflow-y-auto bg-background p-3 fade-in md:p-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-foreground">Staff signup requests</h3>
        <p className="text-sm text-muted-foreground">
          Users who asked for staff access at signup need approval before they can use the backoffice.
        </p>
      </div>

      {actionError ? (
        <p className="mb-4 rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{actionError}</p>
      ) : null}

      <Card className="card-shadow flex min-h-0 flex-1 flex-col border-0 overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Pending</CardTitle>
          <CardDescription>
            Approve to grant the <span className="font-medium text-foreground">staff</span> role, or reject the request.
          </CardDescription>
        </CardHeader>
        <CardContent className="custom-scroll flex min-h-0 flex-1 flex-col overflow-auto p-6 pt-0">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-12 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Loading…
            </div>
          ) : loadError ? (
            <p className="rounded-md border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">{loadError}</p>
          ) : rows.length === 0 ? (
            <p className="py-12 text-center text-sm text-muted-foreground">No pending staff requests.</p>
          ) : (
            <div className="overflow-x-auto -mx-6 px-6 sm:mx-0 sm:px-0">
              <Table>
                <TableHeader className="refer-table-header">
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead className="hidden sm:table-cell">Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((row) => (
                    <TableRow key={row.id} className="transition-colors hover:bg-muted/50">
                      <TableCell className="font-medium text-foreground">{row.full_name || "—"}</TableCell>
                      <TableCell className="text-muted-foreground">{row.email}</TableCell>
                      <TableCell className="hidden text-sm text-muted-foreground sm:table-cell">
                        {new Date(row.created_at).toLocaleString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex flex-wrap justify-end gap-2">
                          <Button
                            type="button"
                            size="sm"
                            className="gradient-primary border-0 text-primary-foreground"
                            disabled={isPending}
                            onClick={() => handleApprove(row.id)}
                          >
                            <UserCheck className="mr-1 h-4 w-4" />
                            Approve
                          </Button>
                          <Button type="button" size="sm" variant="outline" disabled={isPending} onClick={() => handleReject(row.id)}>
                            <XCircle className="mr-1 h-4 w-4" />
                            Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
