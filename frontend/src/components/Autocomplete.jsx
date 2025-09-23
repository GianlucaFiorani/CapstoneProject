import { Col, ListGroup, Row } from "react-bootstrap";
import { BsGeoAltFill, BsGeoFill } from "react-icons/bs";

const Autocomplete = ({ search, setSearch, go }) => {
  return (
    <ListGroup className=" position-absolute z-1000 mt-1" style={{ width: "100%" }}>
      {search.slice(0, 4).map((sugg) => (
        <ListGroup.Item
          style={{ cursor: "pointer" }}
          onClick={() => {
            go([sugg.lat, sugg.lon]);
            setSearch([]);
          }}
          key={sugg.place_id}
          className="px-2 "
        >
          <div className="d-flex flex-wrap">
            <BsGeoFill className="fs-5 mb-2 me-1" />
            <div>
              <span className="fs-7 fw-semibold mb-0 pb-0">{sugg.display_name.split(",")[0]}</span>
            </div>
          </div>

          <span className="fs-8 py-0 my-0 text-secondary" style={{ lineHeight: 1.2, whiteSpace: "normal" }}>
            {sugg.display_name
              .split(",")
              .slice(1)
              .map((part, i) => (
                <div key={i}>{part.trim()}</div>
              ))}
          </span>
        </ListGroup.Item>
      ))}
    </ListGroup>
  );
};
export default Autocomplete;
