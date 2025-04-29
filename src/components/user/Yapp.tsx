import ContactForm from "./ContactForm";
import bgImage from "../../assets/bg.jpg";
import property from "../../assets/property.png";

function Yapp() {
  return (
    <div
      className="text-white"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        position: "relative",
        minHeight: "100vh",
      }}
    >
      <div
        style={{
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          zIndex: 0,
        }}
      />
      <div className="container position-relative z-1 py-5">
        <section className="mb-5">
          <h2 className="fw-bold display-5">
            Invest in property listed by our Associated Banks.
          </h2>

          <div className="row g-4 mt-4">
            <div className="col-md-6">
              <div className="p-4 rounded bg-dark bg-opacity-50 h-100">
                <h5 className="fw-bold">Queries Ask Us?</h5>

                <ContactForm />
              </div>
            </div>

            <div className="col-md-6">
              <div className="p-4 rounded bg-dark bg-opacity-50 h-100 text-center">
                <img src={property} alt="property" className="img-fluid mb-3" />
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Yapp;
