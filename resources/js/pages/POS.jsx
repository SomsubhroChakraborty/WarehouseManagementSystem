import { useState, useMemo } from 'react';
import { Head, router } from '@inertiajs/react';

export default function Index({ categories }) {
    const [activeCategory, setActiveCategory] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [cart, setCart] = useState([]);
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [paidAmount, setPaidAmount] = useState('');
    const [discount, setDiscount] = useState(0);
    const [tax, setTax] = useState(0);
    const [processing, setProcessing] = useState(false);

    const products = useMemo(() => {
        if (!activeCategory) {
            return categories.flatMap((cat) => cat.products ?? []);
        }
        const cat = categories.find((c) => c.id === activeCategory);
        return cat ? cat.products ?? [] : [];
    }, [categories, activeCategory]);

    function addToCart(product, varient) {
        setSelectedProduct(null);
        setCart((prev) => {
            const existing = prev.find((item) => item.varient_id === varient.id);

            if (existing) {
                if (existing.quantity + 1 > varient.varient_qty) {
                    alert(`Only ${varient.varient_qty} left in stock.`);
                    return prev;
                }
                return prev.map((item) =>
                    item.varient_id === varient.id
                        ? {
                              ...item,
                              quantity: item.quantity + 1,
                              total: (item.quantity + 1) * item.price,
                          }
                        : item
                );
            }

            if (varient.varient_qty < 1) {
                alert('Out of stock.');
                return prev;
            }

            return [
                ...prev,
                {
                    product_id: product.id,
                    varient_id: varient.id,
                    name: `${product.name} - ${varient.name}`,
                    price: varient.price,
                    quantity: 1,
                    total: varient.price,
                    max_qty: varient.varient_qty,
                },
            ];
        });
    }

    function updateQuantity(varient_id, quantity) {
        quantity = parseInt(quantity) || 0;

        setCart((prev) =>
            prev.map((item) => {
                if (item.varient_id !== varient_id) return item;

                if (quantity > item.max_qty) {
                    alert(`Only ${item.max_qty} left in stock.`);
                    quantity = item.max_qty;
                }

                return {
                    ...item,
                    quantity,
                    total: quantity * item.price,
                };
            })
        );
    }

    function removeFromCart(varient_id) {
        setCart((prev) => prev.filter((item) => item.varient_id !== varient_id));
    }

    const subtotal = useMemo(
        () => cart.reduce((sum, item) => sum + Number(item.total), 0),
        [cart]
    );

    const grandTotal = useMemo(() => {
        const afterDiscount = subtotal - Number(discount || 0);
        return afterDiscount + Number(tax || 0);
    }, [subtotal, discount, tax]);

    const changeAmount = useMemo(() => {
        const change = Number(paidAmount || 0) - grandTotal;
        return change > 0 ? change : 0;
    }, [paidAmount, grandTotal]);

    function generateInvoiceNo() {
        return 'INV-' + Date.now();
    }

    function handleCheckout() {
        if (cart.length === 0) {
            alert('Cart is empty.');
            return;
        }

        if (Number(paidAmount) < grandTotal) {
            alert('Paid amount is less than grand total.');
            return;
        }

        const payload = {
            invoice_no: generateInvoiceNo(),
            subtotal,
            discount: Number(discount) || 0,
            tax: Number(tax) || 0,
            grand_total: grandTotal,
            payment_method: paymentMethod,
            paid_amount: Number(paidAmount),
            change_amount: changeAmount,
            items: cart.map((item) => ({
                product_id: item.product_id,
                varient_id: item.varient_id,
                quantity: item.quantity,
                price: item.price,
                total: item.total,
            })),
        };

        setProcessing(true);

        router.post('/pos', payload, {
            preserveScroll: true,
            onSuccess: () => {
                setCart([]);
                setPaidAmount('');
                setDiscount(0);
                setTax(0);
            },
            onFinish: () => {
                setProcessing(false);
            },
        });
    }

    return (
        <>
            <Head title="POS" />

            <div className="flex h-screen bg-gray-950 text-gray-100">
                {/* Left: Categories + Products */}
                <div className="w-2/3 flex flex-col p-4 overflow-hidden">
                    {/* Categories */}
                    <div className="flex gap-2 mb-4 overflow-x-auto">
                        <button
                            onClick={() => setActiveCategory(null)}
                            className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                                activeCategory === null
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                            }`}
                        >
                            All
                        </button>
                        {categories.map((cat) => (
                            <button
                                key={cat.id}
                                onClick={() => setActiveCategory(cat.id)}
                                className={`px-4 py-2 rounded-lg whitespace-nowrap transition ${
                                    activeCategory === cat.id
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                                }`}
                            >
                                {cat.name}
                            </button>
                        ))}
                    </div>

                    {/* Products */}
                    <div className="grid grid-cols-4 gap-3 overflow-y-auto flex-1 content-start">
                        {products.map((product) => {
                            const varients = product.varients ?? [];
                            const minPrice = varients.length
                                ? Math.min(...varients.map((v) => v.price))
                                : 0;

                            return (
                                <div
                                    key={product.id}
                                    onClick={() => setSelectedProduct(product)}
                                    className="bg-gray-900 border border-gray-800 rounded-lg p-3 cursor-pointer hover:border-blue-600 transition"
                                >
                                    <p className="font-medium text-sm text-gray-100 truncate">
                                        {product.name}
                                    </p>
                                    <div className="flex items-center justify-between mt-1">
                                        <span className="text-blue-400 font-bold text-sm">
                                            ₹{minPrice}
                                        </span>
                                        <span className="text-xs text-gray-500">
                                            {varients.length}{' '}
                                            {varients.length === 1 ? 'var' : 'vars'}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Right: Cart */}
                <div className="w-1/3 bg-gray-900 p-4 flex flex-col border-l border-gray-800">
                    <h2 className="text-lg font-bold mb-4 text-gray-100">Cart</h2>

                    <div className="flex-1 overflow-y-auto">
                        {cart.length === 0 && (
                            <p className="text-gray-500 text-sm">No items added.</p>
                        )}

                        {cart.map((item) => (
                            <div
                                key={item.varient_id}
                                className="flex items-center justify-between border-b border-gray-800 py-2"
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-100">
                                        {item.name}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        ₹{item.price} x {item.quantity} = ₹{item.total}
                                    </p>
                                </div>
                                <input
                                    type="number"
                                    min="1"
                                    value={item.quantity}
                                    onChange={(e) =>
                                        updateQuantity(item.varient_id, e.target.value)
                                    }
                                    className="w-14 bg-gray-800 border border-gray-700 rounded px-1 py-1 text-sm mr-2 text-gray-100 focus:outline-none focus:border-blue-600"
                                />
                                <button
                                    onClick={() => removeFromCart(item.varient_id)}
                                    className="text-red-400 text-sm hover:text-red-300"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Totals */}
                    <div className="border-t border-gray-800 pt-4 mt-4 space-y-2">
                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Subtotal</span>
                            <span>₹{subtotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-300">
                            <span>Discount</span>
                            <input
                                type="number"
                                value={discount}
                                onChange={(e) => setDiscount(e.target.value)}
                                className="w-24 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-right text-gray-100 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-300">
                            <span>Tax</span>
                            <input
                                type="number"
                                value={tax}
                                onChange={(e) => setTax(e.target.value)}
                                className="w-24 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-right text-gray-100 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div className="flex justify-between font-bold text-lg text-gray-100">
                            <span>Grand Total</span>
                            <span>₹{grandTotal.toFixed(2)}</span>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-300">
                            <span>Payment Method</span>
                            <select
                                value={paymentMethod}
                                onChange={(e) => setPaymentMethod(e.target.value)}
                                className="bg-gray-800 border border-gray-700 rounded px-2 py-1 text-gray-100 focus:outline-none focus:border-blue-600"
                            >
                                <option value="cash">Cash</option>
                                <option value="card">Card</option>
                                <option value="upi">UPI</option>
                            </select>
                        </div>

                        <div className="flex justify-between items-center text-sm text-gray-300">
                            <span>Paid Amount</span>
                            <input
                                type="number"
                                value={paidAmount}
                                onChange={(e) => setPaidAmount(e.target.value)}
                                className="w-24 bg-gray-800 border border-gray-700 rounded px-2 py-1 text-right text-gray-100 focus:outline-none focus:border-blue-600"
                            />
                        </div>

                        <div className="flex justify-between text-sm text-gray-300">
                            <span>Change</span>
                            <span>₹{changeAmount.toFixed(2)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={processing}
                            className="w-full bg-blue-600 hover:bg-blue-500 text-white py-3 rounded-lg font-semibold mt-2 disabled:opacity-50 transition"
                        >
                            {processing ? 'Processing...' : 'Complete Sale'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Variant Selection Modal */}
            {selectedProduct && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50"
                    onClick={() => setSelectedProduct(null)}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        className="bg-gray-900 border border-gray-800 rounded-lg w-full max-w-md max-h-[80vh] overflow-y-auto p-5"
                    >
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-gray-100">
                                {selectedProduct.name}
                            </h3>
                            <button
                                onClick={() => setSelectedProduct(null)}
                                className="text-gray-400 hover:text-gray-200"
                            >
                                ✕
                            </button>
                        </div>

                        <div className="space-y-2">
                            {(selectedProduct.varients ?? []).map((varient) => {
                                const outOfStock = varient.varient_qty < 1;

                                return (
                                    <button
                                        key={varient.id}
                                        disabled={outOfStock}
                                        onClick={() =>
                                            addToCart(selectedProduct, varient)
                                        }
                                        className={`w-full flex items-center justify-between border rounded-lg px-4 py-3 transition ${
                                            outOfStock
                                                ? 'border-gray-800 opacity-40 cursor-not-allowed'
                                                : 'border-gray-700 hover:border-blue-600 hover:bg-gray-800'
                                        }`}
                                    >
                                        <div className="text-left">
                                            <p className="text-sm font-medium text-gray-100">
                                                {varient.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Stock: {varient.varient_qty}
                                            </p>
                                        </div>
                                        <p className="text-blue-400 font-bold">
                                            ₹{varient.price}
                                        </p>
                                    </button>
                                );
                            })}

                            {(selectedProduct.varients ?? []).length === 0 && (
                                <p className="text-gray-500 text-sm">
                                    No variants available.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}