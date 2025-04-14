import bank1 from "../../assets/banks/bank1.png";
import bank2 from "../../assets/banks/bank2.png";
import bank3 from "../../assets/banks/bank3.png";
import bank4 from "../../assets/banks/bank4.png";
import bank5 from "../../assets/banks/bank5.jpg";
import bank6 from "../../assets/banks/bank6.png";

const banks = [
  { src: bank1, alt: "Bank 1" },
  { src: bank2, alt: "Bank 2" },
  { src: bank3, alt: "Bank 3" },
  { src: bank4, alt: "Bank 4" },
  { src: bank5, alt: "Bank 5" },
  { src: bank6, alt: "Bank 6" },
];

const AssociatedBank = () => {
  return (
    <div className="bg-light py-5">
      <div className="container text-center text-dark">
        <h2 className="mb-4 fw-bold">Our Trusted Banks</h2>
        <div className="row justify-content-center align-items-center g-4">
          {banks.map((bank, index) => (
            <div className="col-6 col-md-3 col-lg-2" key={index}>
              <img
                src={bank.src}
                alt={bank.alt}
                className="img-fluid"
                style={{ maxHeight: "50px", objectFit: "contain" }}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AssociatedBank;
