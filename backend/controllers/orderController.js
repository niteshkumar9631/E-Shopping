import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import razorpay from "razorpay";
import { sendOrderEmail, sendInvoiceEmail } from "../config/emailService.js";
import { generateInvoice } from "../config/invoiceGenerator.js";




// global variables
const deliveryCharge = 10;
const currency = "inr";
const razorepayInstance = new razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})


// Placing Order using COD method
const placeOrder = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;
    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "COD",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData)
    await newOrder.save();

    // Send Email
    const user = await userModel.findById(userId);
    if (user?.email) {
      await sendOrderEmail(user.email, items, amount);
    }

    await userModel.findByIdAndUpdate(userId, { cartData: {} });
    res.json({ success: true, message: "Order Placed Successfully", });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }

}

// Placing Order using Razorpay method

const placeOrderRazorpay = async (req, res) => {
  try {
    const { userId, items, amount, address } = req.body;

    const orderData = {
      userId,
      items,
      address,
      amount,
      paymentMethod: "Razorpay",
      payment: false,
      date: Date.now(),
    };

    const newOrder = new orderModel(orderData)
    await newOrder.save();

    const options = {
      amount: amount * 100,
      currency: currency.toUpperCase(),
      receipt: newOrder._id.toString(),
    }

    await razorepayInstance.orders.create(options, (error, order) => {
      if (error) {
        console.log(error);
        return res.json({ success: false, message: error })

      }
      res.json({ success: true, order })

    })

  } catch (error) {

    console.log(error);
    res.json({ success: false, message: error.message });

  }
}


// Verify Order using Razorpay method

const verifyRazorpay = async (req, res) => {
  try {

    const { userId, razorpay_order_id } = req.body

    const orderInfo = await razorepayInstance.orders.fetch(razorpay_order_id)
    if (orderInfo.status === 'paid') {
      await orderModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
      await userModel.findByIdAndUpdate(userId, { cartData: {} })


      // Get user email and order data
      const user = await userModel.findById(userId);
      const order = await orderModel.findById(orderInfo.receipt);

      if (user?.email) {
        await sendOrderEmail(user.email, order.items, order.amount);
      }


      res.json({ success: true, message: "Payment Successful" })
    } else {
      res.json({ success: false, message: "Payment Failed" })

    }

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// All order data for Admin Panel
const allOrders = async (req, res) => {
  try {
    const orders = await orderModel.find({})
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
}

// User Order Data for Frontend
const userOrders = async (req, res) => {
  try {
    const { userId } = req.body;
    const orders = await orderModel.find({ userId });
    res.json({ success: true, orders });
  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



// User Order Data for Frontend
const updateStatus = async (req, res) => {
  try {
    const { orderId, status } = req.body;

    // Step 1: Update the order status
    const updatedOrder = await orderModel.findByIdAndUpdate(orderId, { status }, { new: true });

    // Step 2: Check if status is "Delivered"
    if (status === "Delivered") {
      // Populate user for email
      const user = await userModel.findById(updatedOrder.userId);
      if (!user?.email) {
        return res.json({ success: false, message: "User email not found" });
      }

      // Add user details to order (for invoice)
      updatedOrder.user = { email: user.email };

      // Step 3: Generate invoice PDF
      const invoiceBuffer = await generateInvoice(updatedOrder);

      // Step 4: Send Invoice Email
      await sendInvoiceEmail(user.email, invoiceBuffer);
    }

    res.json({ success: true, message: "Status Updated" });

  } catch (error) {
    console.log(error);
    res.json({ success: false, message: error.message });
  }
};



export { verifyRazorpay, placeOrder, placeOrderRazorpay, allOrders, userOrders, updateStatus }