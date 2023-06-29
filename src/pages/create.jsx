import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProducts, selectProduct, updateQuantity } from "../features/productSlice";
import { createOrder } from "../features/orderSlice";
import "./create.css"

const Create = () => {
    const user = useSelector((state) => state.auth.authorize);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user]);

    const dispatch = useDispatch();
    const products = useSelector((state) => state.product.items);
    const isLoading = useSelector((state) => state.product.loading);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const selectedProducts = useSelector((state) => state.product.selectedProducts);
    const [orderDate, setOrderDate] = useState(new Date().toLocaleDateString());
    const [orderStatus, setOrderStatus] = useState(null);

    const handleSearch = (event) => {
        const value = event.target.value;
        setSearchTerm(value);
        console.log(searchResults)
        console.log(value)
        const filteredResults = products.filter((product) =>
            product.name.toLowerCase().includes(value.toLowerCase())
        );
        console.log(filteredResults)
        setSearchResults(filteredResults);
    }

    const handleProductSelect = (product) => {
        const isSelected = selectedProducts.find((selectedProduct) => selectedProduct.id === product.id);
        if (isSelected) {
            dispatch(selectProduct(selectedProducts.filter((p) => p.id !== product.id)));
        } else {
            const updatedProduct = { ...product, quantity: 1 }; 
            dispatch(selectProduct([...selectedProducts, updatedProduct]));
        }
    }

    const handleQuantityChange = (event, product) => {
        const updatedProducts = selectedProducts.map((selectedProduct) => {
            if (selectedProduct.id === product.id) {
                return { ...selectedProduct, quantity: parseInt(event.target.value, 10) };
            }
            return selectedProduct;
        });
        console.log(updatedProducts)
        dispatch(updateQuantity(updatedProducts));
    }

    const handleSubmitOrder = (event) => {
        event.preventDefault();
        const uniqueId = Date.now().toString();
        const order = {
            orderId: uniqueId,
            products: selectedProducts,
            date: orderDate ? orderDate : new Date().toLocaleDateString(),
        };
        try {
            dispatch(createOrder(order));
            setOrderStatus("success");
        } catch (error) {
            setOrderStatus("fail");
        }
    };

    const handleOrderDateSelect = (event) => {
        const selectedDate = event.target.value;
        setOrderDate(selectedDate);
    };

    useEffect(() => {
        const timer = setTimeout(() => {
            setOrderStatus(null);
          }, 1000);
        
          return () => {
            clearTimeout(timer);
          };
    }, [orderStatus]);

    useEffect(() => {
        dispatch(fetchProducts());
    }, [dispatch]);

    useEffect(() => {
        setSearchResults(products);
    }, [products]);

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container">
            <div className="left-panel">
                <h1>Product Menu</h1>
                <input
                    type="text"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={handleSearch}
                />
                {
                    <ul className="product-menu">
                        {searchResults.map((product) => (
                            <li key={product.id}
                                className={selectedProducts.find((p) => p.id === product.id) ? 'selected' : ''}

                                onClick={() => handleProductSelect(product)}
                            >
                                {product.name}
                            </li>
                        ))}
                    </ul>
                }
            </div>
            <div className="right-panel">
                <h1>Create Order</h1>
                <form onSubmit={handleSubmitOrder}>
                    {selectedProducts.length > 0 && (
                        <div>
                            <h2>Selected Products:</h2>
                            <ul className="select-products">
                                {selectedProducts.map((product) => (
                                    <li key={product.id}>
                                        {product.name}
                                        <input
                                            type="number"
                                            min="1"
                                            value={product.quantity}
                                            onChange={(event) => handleQuantityChange(event, product)}
                                        />
                                    </li>
                                ))}
                            </ul>
                            <div>
                                <label htmlFor="orderDate">Order Date:</label>
                                <input
                                    type="date"
                                    id="orderDate"
                                    value={orderDate}
                                    onChange={handleOrderDateSelect}
                                />
                            </div>
                        </div>

                    )}
                    <div>
                        {orderStatus === "success" && <p>Order submitted successfully!</p>}
                        {orderStatus === "fail" && <p>Failed to submit the order. Please try again.</p>}
                    </div>
                    <div style={{ padding: "15px" }}>
                        <button className="custom-button" type="submit" disabled={selectedProducts.length === 0}>
                            Create Order
                        </button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default Create;