import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

// PUT — update an inventory item (admin: edit details, adjust stock counts)
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const body = await req.json();
  const {
    name, sku, category, unit, costPrice, sellingPrice,
    mainStoreCount, frontStoreCount, lowStockAlert, available, linkedMenuItemId,
  } = body;

  const item = await prisma.inventoryItem.update({
    where: { id },
    data: {
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(sku !== undefined ? { sku: sku?.trim() || null } : {}),
      ...(category !== undefined ? { category: category.trim() } : {}),
      ...(unit !== undefined ? { unit } : {}),
      ...(costPrice !== undefined ? { costPrice } : {}),
      ...(sellingPrice !== undefined ? { sellingPrice } : {}),
      ...(mainStoreCount !== undefined ? { mainStoreCount } : {}),
      ...(frontStoreCount !== undefined ? { frontStoreCount } : {}),
      ...(lowStockAlert !== undefined ? { lowStockAlert } : {}),
      ...(available !== undefined ? { available } : {}),
      ...(linkedMenuItemId !== undefined ? { linkedMenuItemId } : {}),
    },
  });

  return NextResponse.json(item);
}

// DELETE — remove an inventory item
export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  await prisma.inventoryItem.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
