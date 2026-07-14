# payments/razorpay_sample.py (server side generation snippet)
import razorpay
client = razorpay.Client(auth=("RAZORPAY_KEY_ID", "RAZORPAY_SECRET"))
order = client.order.create({"amount": 49900, "currency": "INR", "receipt": "order_rcptid_11"})
# return order['id'] to frontend to complete payment
