import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setHasDiscount } from "../../app/slices/searchingSlice";
function ToggleSwitch() {
  const dispatch = useDispatch();
  const { hasDiscount } = useSelector((state) => state.searching);
  const [isOn, setIsOn] = useState(hasDiscount);

  useEffect(() => {
    setIsOn(hasDiscount);
  }, [hasDiscount]);

  const handleToggle = () => {
    const newValue = !isOn;
    setIsOn(newValue);
    dispatch(setHasDiscount(newValue));
  };
  return (
    <div>
      <div className="">
        <div className="flex justify-between items-center">
          <h2>خصومات</h2>
          <label
            style={{
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              direction: "rtl",
            }}
          >
            <input
              type="checkbox"
              checked={isOn}
              onChange={handleToggle}
              style={{ display: "none" }}
            />
            <div
              style={{
                width: "50px",
                height: "25px",
                background: isOn ? "#009688" : "#ccc",
                borderRadius: "25px",
                position: "relative",
                transition: "background 0.3s",
              }}
            >
              <div
                style={{
                  position: "absolute",
                  top: "2px",
                  left: isOn ? "2px" : "26px",
                  width: "21px",
                  height: "21px",
                  background: "white",
                  borderRadius: "50%",
                  transition: "left 0.3s",
                }}
              />
            </div>
          </label>
        </div>
      </div>
    </div>
  );
}

export default ToggleSwitch;
