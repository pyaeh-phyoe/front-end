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
            navigate('/login')
        }
    }, [user])

    const orders = useSelector((state) => state.order.orders);
    const isLoading = useSelector((state) => state.order.loading);
    const [filteredResults, setFilteredResults] = useState(orders)

    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');

    const filterOrdersByDateRange = (orders, startDate, endDate) => {
        const filteredOrders = orders.filter((order) => {
            const orderDate = new Date(order.date);

            // If no start date is provided, default to today
            const rangeStartDate = startDate ? new Date(startDate) : new Date();

            // If no end date is provided, default to today
            const rangeEndDate = endDate ? new Date(endDate) : new Date();

            // Adjust the time of the rangeEndDate to the end of the day
            rangeEndDate.setHours(23, 59, 59, 999);

            return orderDate >= rangeStartDate && orderDate <= rangeEndDate;
        });

        console.log(filteredOrders)

        return filteredOrders;
    };

    const handleFilter = () => {
        // Pass the orders, startDate, and endDate to the filterOrdersByDateRange function
        console.log(startDate, endDate)

        const filteredOrders = filterOrdersByDateRange(orders, startDate, endDate);
        // Do something with the filtered orders
        console.log(filteredOrders);
    };

    const [filterTodayOrders, setFilterTodayOrders] = useState(true)

    useEffect(() => {
        dispatch(fetchOrders());
    }, [dispatch]);

    useEffect(() => {
        if (filterTodayOrders) {
            const today = new Date().toLocaleDateString()
        
        console.log(today)
        console.log(filterTodayOrders)
        const filteredTodayOrders = orders && orders.filter((order) => {
            const orderDate = new Date(order.date).toLocaleDateString();

            console.log(orderDate)
            return today === orderDate

        })

        setFilteredResults(filteredTodayOrders)

        console.log(filteredTodayOrders)

        } else {
            setFilteredResults(orders)
        }
        


    }, [filterTodayOrders, orders])

    if (isLoading) {
        return <div>Loading...</div>;
    }
    console.log(orders)
    console.log(filteredResults)
    return (
        <div>
            <header>
                <h1>Order List</h1>
            </header>
            <div>
                <div>
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
                <button onClick={handleFilter}>Filter</button>
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
                            <th>Order</th>
                            <th>Products</th>
                            <th>Quantity</th>
                            <th>Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredResults.map((order) => (
                            <tr key={order.orderId}>
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
                <button onClick={() => navigate('/create')}>create order</button>
                <button onClick={() => dispatch(logout())}>logout</button>
            </footer>


        </div>
    );
}

export default Home;