"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Separator } from "@/components/ui/separator";
import type { Order } from "@/types/order";
import { useT } from "@/app/providers/lang-provider";

export default function OrdersPage() {
  const t = useT();
  const { data, isLoading, error, refetch } = useQuery<Order[]>({
    queryKey: ["orders"],
    queryFn: async () => {
      const res = await fetch("/api/orders");
      if (!res.ok) throw new Error("Failed to load orders");
      return res.json();
    },
  });

  return (
    <div className="p-4">
      <Card>
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">{t?.orders?.title ?? "My Orders"}</h2>
            <button onClick={() => refetch()} className="text-sm underline">{t?.orders?.refresh ?? "Refresh"}</button>
          </div>
          <Separator />

          {isLoading && <p className="text-sm text-muted-foreground">Loading...</p>}
          {error && <p className="text-sm text-destructive">{String((error as any)?.message || error)}</p>}

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t?.orders?.table?.id ?? "Order ID"}</TableHead>
                  <TableHead>{t?.orders?.table?.car ?? "Car Type"}</TableHead>
                  <TableHead>{t?.orders?.table?.from ?? "From"}</TableHead>
                  <TableHead>{t?.orders?.table?.to ?? "To"}</TableHead>
                  <TableHead>{t?.orders?.table?.price ?? "Price"}</TableHead>
                  <TableHead>{t?.orders?.table?.status ?? "Status"}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(data || []).map((o) => (
                  <TableRow key={o.id}>
                    <TableCell className="font-medium">{o.id}</TableCell>
                    <TableCell>{o.carType} - {o.carModel}</TableCell>
                    <TableCell>{o.fromCity}</TableCell>
                    <TableCell>{o.toCity}</TableCell>
                    <TableCell>{o.price?.toFixed?.(2) ?? 0}</TableCell>
                    <TableCell className="capitalize">{o.status.replaceAll('_',' ')}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
