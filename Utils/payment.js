const paypalSDK = require('@paypal/checkout-server-sdk');

const paypalClient = (() => {
    const id = process.env.PAYPAL_CLIENT_ID;
    const secret = process.env.PAYPAL_SECRET_KEY;
    if(!id || !secret) return null;

    const env = new paypalSDK.core.SandboxEnvironment(id, secret);
    return new paypalSDK.core.PayPalHttpClient(env);
})();

exports.createPayPalOrder = async (items = []) => {
    if(!paypalClient) throw new Error('PayPal not configured');
    const total = items.reduce((sum, it) => sum + it.price * it.quantity, 0).toFixed(2);

    const request = new paypalSDK.orders.OrdersCreateRequest();
    request.prefer('return=representation');
    request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [{ amount: {currency_code: 'USD', value: total } }]
    });

    const response = await paypalClient.execute(request);
    return response.result;
};