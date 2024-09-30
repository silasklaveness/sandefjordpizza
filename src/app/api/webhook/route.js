import { Order } from "@/app/models/Order";
import { Resend } from "resend";
import Welcome from "@/emails/Welcome";

const stripe = require("stripe")(process.env.STRIPE_SK);
const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) {
  const sig = req.headers.get("stripe-signature");
  let event;

  try {
    const reqBuffer = await req.text();
    const signSecret = process.env.STRIPE_SIGN_SECRET;
    event = stripe.webhooks.constructEvent(reqBuffer, sig, signSecret);
  } catch (e) {
    console.error("stripe error");
    console.log(e);
    return Response.json(e, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    console.log(event);
    const orderId = event?.data?.object?.metadata?.orderId;
    const isPaid = event?.data?.object?.payment_status === "paid";
    const email = event?.data?.object?.customer_email;
    const firstName = event?.data?.object?.customer_details?.name;
    const success_url = event?.data?.object?.success_url;
    const amount_total = event?.data?.object?.amount_total;
    const amount_subtotal = event?.data?.object?.amount_subtotal;
    console.log(amount_subtotal, amount_total);
    if (isPaid) {
      await Order.updateOne({ _id: orderId }, { paid: true });
      try {
        await resend.emails.send({
          from: "kunde@oceanedge.no",
          to: email, // Use the customer's email from the order
          subject: "Welcome!",
          react: Welcome({
            firstName,
            success_url,
            amount_total,
            amount_subtotal,
          }),
        });
        console.log(`Welcome email sent `);
      } catch (emailError) {
        console.error("Error sending email:", emailError);
      }
    }
  }

  return Response.json("ok", { status: 200 });
}
