import { useFormikContext } from "formik";
import { displayMoney, formatCents } from "../../../helpers/utils";
import PropType from "prop-types";
import React, { useContext, useEffect } from "react";
import { Context } from "../../../Context";

const ShippingTotal = ({ subtotal }) => {
  const { values } = useFormikContext();
  const { setCost } = useContext(Context);
  const total = Number(subtotal) + (values.isInternational ? 50 : 0);
  const displayTotal = displayMoney(total);
  const cents = formatCents(total);

  useEffect(() => {
    setCost(cents);
  }, []);

  return (
    <div className="checkout-total d-flex-end padding-right-m">
      <table>
        <tbody>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                International Shipping: &nbsp;
              </span>
            </td>
            <td>
              <h4 className="basket-total-amount text-subtle text-right margin-0 ">
                {values.isInternational ? "$50.00" : "$0.00"}
              </h4>
            </td>
          </tr>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Subtotal: &nbsp;
              </span>
            </td>
            <td>
              <h4 className="basket-total-amount text-subtle text-right margin-0">
                {displayMoney(subtotal)}
              </h4>
            </td>
          </tr>
          <tr>
            <td>
              <span className="d-block margin-0 padding-right-s text-right">
                Total: &nbsp;
              </span>
            </td>
            <td>
              <h2 className="basket-total-amount text-right">{displayTotal}</h2>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

ShippingTotal.propTypes = {
  subtotal: PropType.number.isRequired,
};

export default ShippingTotal;
