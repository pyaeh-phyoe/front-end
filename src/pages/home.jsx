import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../features/authSlice";
import { fetchOrders } from "../features/orderSlice";
import "./home.css"


const Home = () => {
    const user = useSelector((state) => state.auth.authorize);
    const dispatch = useDispatch()
    const navigate = useNavigate()

    useEffect(() => {
        if (!user) {
            navigate("/login")
        }
    }, [user])

    const orders = useSelector((state) => state.order.orders);
    const isLoading = useSelector((state) => state.order.loading);
    const [filteredResults, setFilteredResults] = useState(orders)

    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [filterTodayOrders, setFilterTodayOrders] = useState(true);


    const filterOrdersByDateRange = (orders, startDate, endDate) => {
        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.date);
            const rangeStartDate = startDate ? new Date(startDate) : new Date();
            const rangeEndDate = endDate ? new Date(endDate) : new Date();
            rangeEndDate.setHours(23, 59, 59, 999);
            return orderDate >= rangeStartDate && orderDate <= rangeEndDate;
        });
        return filteredOrders;
    };

    const handleFilter = () => {
        if (startDate && endDate) {
            const filteredOrders = filterOrdersByDateRange(orders, startDate, endDate);
            console.log(filteredOrders);
            setFilteredResults(filteredOrders)
        }
    };

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    useEffect(() => {
        if (filterTodayOrders) {
            const today = new Date().toLocaleDateString();
            const filteredTodayOrders = orders && orders.filter((order) => {
                const orderDate = new Date(order.date).toLocaleDateString();
                return today === orderDate;
            })
            setFilteredResults(filteredTodayOrders);
        } else {
            setFilteredResults(orders);
        }
    }, [filterTodayOrders, orders])

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <header>
                <h1>Order List</h1>
            </header>
            <div>
                <div className="filter-range__container">
                    <div>
                        <label>From: </label>
                        <input
                            type="date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <label>To: </label>
                        <input
                            type="date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                        />
                    </div>
                    <div>
                        <button onClick={handleFilter}>Filter</button>
                    </div>
                </div>

                <label>
                    <input
                        type="checkbox"
                        checked={filterTodayOrders}
                        onChange={(e) => setFilterTodayOrders(e.target.checked)}
                    />
                    Today's Orders
                </label>
            </div>

            {filteredResults && filteredResults.length > 0 ? (
                <table className="order-list">
                    <thead>
                        <tr>
                            <th>No</th>
                            <th>Order</th>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.map((order, i) => (
                            <tr key={order.orderId}>
                                <td>{i}.</td>
                                <td>#{order.orderId}</td>
                                <td>
                                    {
                                        order.products.map((product, index) => {
                                            return <div key={index}><span>{product.name}</span></div>
                                        })
                                    }
                                </td>
                                <td>
                                    {
                                        order.products.map((product, index) => {
                                            return <div key={index}><span>{product.quantity}</span></div>
                                        })
                                    }
                                </td>
                                <td>{new Date(order.date).toLocaleDateString()}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div>No orders found.</div>
            )}
            <footer>
                <button className="custom-button" onClick={() => navigate("/create")}>create order</button>
                <button className="custom-button" onClick={() => dispatch(logout())}>logout</button>
            </footer>
        </div>
    );
}

export default Home;