import { db } from '@/db'
import { getKindeServerSession } from '@kinde-oss/kinde-auth-nextjs/server'
import { notFound } from 'next/navigation'
import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card'
import { formatePrice } from '@/lib/utils'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import StatusDropdown from './StatusDropDown'

 async function  page() {

const  {getUser} =getKindeServerSession()
const user=await getUser()
const ADMIN_EMAIL =process.env.ADMIN_EMAIL

if (!user ||user.email !== ADMIN_EMAIL) {
    return notFound()
}
const order = await db.order.findMany({
    where:{
        isPaid:true,
        createdAt:{
            gte:new Date(new Date().setDate(new Date().getDate() -7))
        }
    },
    orderBy:{
        createdAt:'desc',

    },
    include:{
        user:true,
        ShippingAddress:true
    }
})

const lastWeekSum = await db.order.aggregate({
    where:{
        isPaid:true,
        createdAt:{
            gte:new Date(new Date().setDate(new Date().getDate() -7))
        }
    },
    _sum:{
        amount:true
    }
})
const lastMonthSum = await db.order.aggregate({
    where:{
        isPaid:true,
        createdAt:{
            gte:new Date(new Date().setDate(new Date().getDate() -30))
        }
    },
    _sum:{
        amount:true
    }
})

const WEEKLY_GOAL = 500
const MONTLY_GOAL = 2500
  return (
    <div className='flex min-h-screen bg-muted/40 '>
       <div className='max-w-7xl mx-auto flex flex-col sm:gap-4 sm:py-4 '>
        <div className='flex flex-col gap-16'>
            <div className='grid gap-4 sm:grid-cols-2 '>
                <Card className='w-full'>
                    <CardHeader className='pb-2'>
                        <CardDescription>
                            last week
                        </CardDescription>
                        <CardTitle className='text-4xl'>
                            {formatePrice(lastWeekSum._sum.amount ?? 0 )}
                        </CardTitle>
                       
                    </CardHeader>
                    <CardContent>
                            <div className='text-sm text-muted-foreground'>
                                of {formatePrice(WEEKLY_GOAL)} goal
                            </div>
                        </CardContent>
                    <CardFooter>
                        <Progress value={(lastWeekSum._sum.amount ?? 0 )*100 /WEEKLY_GOAL}/>
                    </CardFooter>
                </Card>
                <Card>
                    <CardHeader className='pb-2'>
                        <CardDescription>
                            last Month
                        </CardDescription>
                        <CardTitle className='text-4xl'>
                            {formatePrice(lastMonthSum._sum.amount ?? 0 )}
                        </CardTitle>
                       
                    </CardHeader>
                    <CardContent>
                            <div className='text-sm text-muted-foreground'>
                                of {formatePrice(WEEKLY_GOAL)} goal
                            </div>
                        </CardContent>
                    <CardFooter>
                        <Progress value={(lastMonthSum._sum.amount ?? 0 )*100 /MONTLY_GOAL}/>
                    </CardFooter>
                </Card>
            </div>

            <h1 className='text-4xl font-bold tracking-tight'>Incoming Orders</h1>
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                          
                            <TableHead className='hidden sm:table-cell'>Customer</TableHead>
                            <TableHead className='hidden sm:table-cell'>Status</TableHead>
                            <TableHead className='hidden sm:table-cell'>PUchase Date</TableHead>
                            <TableHead className='text-right'>Amount</TableHead>
                            
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {order.map((orders)=>(
                                <TableRow>
                                    <TableCell>
                                        <div className='font-medium'>
                                            {orders.ShippingAddress?.name}
                                        </div>
                                        <div className='hidden sm:block text-sm text-muted-foreground '>
                                            {orders.user.email}
                                        </div>
                                    </TableCell>

                                    <TableCell className='hidden sm:table-cell'><StatusDropdown id={orders.id} orderStatus={orders.status}  /></TableCell>
                                    <TableCell>{orders.createdAt.toLocaleDateString()}</TableCell>
                                   
                                    <TableCell className='text-right'>
                                        {formatePrice(orders.amount)}
                                    </TableCell>
                                </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
       </div>
    </div>
  )
}

export default page