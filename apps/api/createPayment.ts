

import Stripe from 'stripe';
const stripe = new Stripe('sk_test_51RPR7RQTXuhvSkyhhI5EAWVgR2dY4lJ26jvD0LtQdYk91gKvkLhEJxzvP72UQzsjDnwfKZoIUEP7ZYcC6CjFH5fg00uxU7mIYR')
// stripe.products.create({
//   name: 'Starter Subscription',
//   description: '$12/Month subscription',
// }).then(product => {
//   stripe.prices.create({
//     unit_amount: 1200,
//     currency: 'usd',
//     recurring: {
//       interval: 'month',
//     },
//     product: product.id,
//   }).then(price => {
//     console.log('Success! Here is your starter subscription product id: ' + product.id);
//     console.log('Success! Here is your starter subscription price id: ' + price.id);
//   });
// });
async function createPaymentMethod(): Promise<string | null> {
  try {
    const paymentMethod = await stripe.paymentMethods.create({
      type: "card",
      card: {
        token: "tok_visa",
      },
    });
    console.log(`Método de pago creado con ID: ${paymentMethod.id}`);
    return paymentMethod.id;
  } catch (error: any) {
    console.error(`Error al crear el método de pago: ${error.message}`);
    return null;
  }
}

// Crear usuario (cliente)
async function createUser(name: string, email: string): Promise<string | null> {
  try {
    const customer = await stripe.customers.create({
      name,
      email,
    });
    console.log(`Cliente ${name} creado correctamente con ID ${customer.id}`);
    return customer.id;
  } catch (error: any) {
    console.error(`Error al crear el cliente: ${error.message}`);
    return null;
  }
}

// Obtener productos
async function getProducts(): Promise<string | null> {
  try {
    const products = await stripe.products.list();
    const productId = products.data[0]?.id;
    console.log("Producto encontrado con ID:", productId);
    return productId;
  } catch (error: any) {
    console.error(`Error al obtener productos: ${error.message}`);
    return null;
  }
}

// Obtener precio del producto
async function getProductPrice(productId: string): Promise<[string, number, string] | null> {
  try {
    const prices = await stripe.prices.list({ product: productId, limit: 1 });
    const price = prices.data[0];
    return [price.id, price.unit_amount!, price.currency];
  } catch (error: any) {
    console.error(`Error al obtener el precio: ${error.message}`);
    return null;
  }
}

// Asociar método de pago al cliente
async function addPaymentMethodToUser(clientId: string, paymentMethodId: string) {
  try {
    await stripe.paymentMethods.attach(paymentMethodId, {
      customer: clientId,
    });
    console.log("Método de pago asociado al cliente correctamente");
  } catch (error: any) {
    console.error(`Error al asociar método de pago: ${error.message}`);
  }
}

// Crear el pago
async function createPayment(
  clientId: string,
  paymentMethodId: string,
  productId: string,
  amount: number,
  currency: string
) {
  try {
    const payment = await stripe.paymentIntents.create({
      amount,
      currency,
      payment_method: paymentMethodId,
      payment_method_types: ["card"],
      customer: clientId,
      confirm: true,
      metadata: {
        product_id: productId,
      },
    });
    console.log(`Pago realizado con éxito con ID: ${payment.id}`);
    return payment;
  } catch (error: any) {
    console.error(`Error al realizar el pago: ${error.message}`);
  }
}

// Ejecución principal
(async () => {
  const clientId = await createUser("Kevin Macas", "kevinmacash@gmail.com");
  if (!clientId) return;

  const paymentMethodId = await createPaymentMethod();
  if (!paymentMethodId) return;

  await addPaymentMethodToUser(clientId, paymentMethodId);

  const productId = await getProducts();
  if (!productId) return;

  const priceData = await getProductPrice(productId);
  if (!priceData) return;

  const [priceId, amount, currency] = priceData;

  await createPayment(clientId, paymentMethodId, productId, amount, currency);
})();