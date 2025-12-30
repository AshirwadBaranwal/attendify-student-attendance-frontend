import Header from "@/components/global/Header";
import WelcomeCard from "./WelcomeCard";

const Dashboard = () => {
  return (
    <div className="">
      <Header />
      <div className="flex   h-[calc(100vh-65px)] ">
        <div className="flex flex-col gap-3 w-full  p-5">
          <WelcomeCard />
        </div>
        <div className="  max-h-[calc(100vh-65px)] overflow-auto w-3/7"></div>
      </div>
    </div>
  );
};

export default Dashboard;
