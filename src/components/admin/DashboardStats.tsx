import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import {
  People,
  Bank,
  Check,
  GraphUpArrow,
  CreditCard,
  Grid,
  ChatDots,
  GraphUp,
} from "react-bootstrap-icons";

const DashboardStats = () => {
  const [users, setUsers] = useState([]);
  const [managers, setManagers] = useState([]);
  const [banks, setBanks] = useState([]);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/user/users")
      .then((res) => setUsers(res.data));
    axios
      .get("http://localhost:5000/api/manager/allmanagers")
      .then((res) => setManagers(res.data));
    axios
      .get("http://localhost:5000/api/bank/bank")
      .then((res) => setBanks(res.data));
    axios
      .get("http://localhost:5000/api/message/messages")
      .then((res) => setMessages(res.data));
  }, []);

  return (
    <>
      <h2>
        <GraphUp className="me-4" />
        Insight Statistics <hr />
      </h2>

      <div className="row g-4">
        <StatCard
          label="Users"
          count={users.length}
          icon={<People />}
          link="/cb-ad/users"
        />
        <StatCard
          label="Managers"
          count={managers.length}
          icon={<People />}
          link="/cb-ad/managers"
        />
        <StatCard
          label="Associated Banks"
          count={banks.length}
          icon={<Bank />}
          link="/cb-ad/banks"
        />
      </div>

      <div className="row g-4 mt-4">
        <StatCard
          label="Verified Users"
          count={25}
          icon={<Check />}
          link="/cb-ad/verifyusers"
        />
        <StatCard
          label="Verified Auctions"
          count={8}
          icon={<GraphUpArrow />}
          link="/cb-ad/verifyauctions"
        />
        <StatCard
          label="Transactions Made"
          count={8}
          icon={<CreditCard />}
          link="/cb-ad/transaction"
        />
      </div>

      <div className="row g-4 mt-4">
        <StatCard
          label="Number of Auctions"
          count={350}
          icon={<Grid />}
          link="/cb-ad/in-auction"
          bg="success"
        />
        <StatCard
          label="Messages"
          count={messages.length}
          icon={<ChatDots />}
          link="/cb-ad/messages"
          bg="primary"
        />
      </div>
    </>
  );
};

type StatCardProps = {
  label: string;
  count: number;
  icon: JSX.Element;
  link: string;
  bg?: string;
};

const StatCard = ({
  label,
  count,
  icon,
  link,
  bg = "secondary",
}: StatCardProps) => (
  <div className="col-12 col-md-4">
    <Link to={link}>
      <div className={`bg-${bg} text-white p-3 rounded shadow-sm text-center`}>
        <h4>
          {icon} <span className="ms-2">{label}</span>
        </h4>
        <h2>{count}</h2>
      </div>
    </Link>
  </div>
);

export default DashboardStats;
