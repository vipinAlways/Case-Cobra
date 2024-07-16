"use server";

import { db } from "@/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";

export const getPaymentStatus = async ({ orderId }: { orderId: string }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user?.id || !user.email) {
    throw new Error("You need to be logged in to view page.");
  }
  const order = await db.order.findUnique({
    where: { id: orderId,userId:user.id },
    include:{
        BillingAddress:true,
        configuration:true,
        ShippingAddress:true,
        user:true
    }

  });

  if (!order) {
    throw new Error('this order does not exist.')
  }

  if (order.isPaid) {
    return order
  }
  else{
    return false
  }
};
