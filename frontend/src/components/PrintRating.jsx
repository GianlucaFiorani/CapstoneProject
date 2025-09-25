import Ball from "./svg/Ball";
import Halfball from "./svg/Halfball";

const PrintRating = ({ ratingAv, size, translate }) => {
  const arrayValue = ratingAv % 1 == 0 ? ratingAv : ratingAv - 0.5;
  return (
    <div className="position-relative" style={{ width: `calc(${size} * 5)`, height: size }}>
      <div className="d-flex position-absolute">
        {[...Array(5)].map((_, index) => {
          const value = index + 1;
          return (
            <div
              key={index}
              style={{
                transform: `translateY(${translate})`,
                height: size,
                width: size,
                fill: "#f4e7e7ff",
              }}
            >
              <Ball />
            </div>
          );
        })}
      </div>
      <div className="d-flex position-absolute">
        {[...Array(arrayValue)].map((_, index) => {
          const value = index + 1;
          return (
            <div
              key={index}
              style={{
                transform: `translateY(${translate})`,
                height: size,
                width: size,
                fill: "#795548",
              }}
            >
              <Ball />
            </div>
          );
        })}
        {!(ratingAv % 1 == 0) && (
          <div
            style={{
              transform: `translateY(${translate})`,
              height: size,
              width: size,
              fill: "#795548",
            }}
          >
            <Halfball />
          </div>
        )}
      </div>
    </div>
  );
};
export default PrintRating;
