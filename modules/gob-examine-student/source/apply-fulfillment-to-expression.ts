/* oxlint-disable typescript/prefer-readonly-parameter-types -- both functions put expr and fulfillment into an expression tree that evaluation writes its results onto, and applyFulfillmentToExpression also writes _fulfillment onto expr and pushes onto expr.$or */
import type { OrExpression, Expression, Fulfillment } from "./types.ts"

function wrapInOr(expr: Expression, fulfillment: Fulfillment): OrExpression {
  // example OR-expression:
  // { $type: "boolean", $or: [{...}, {...}] }
  let wrapper: OrExpression = {
    $type: "boolean",
    $booleanType: "or",
    $or: [expr, fulfillment],
  }
  wrapper._fulfillment = fulfillment
  return wrapper
}

export default function applyFulfillmentToExpression(
  expr: Expression,
  fulfillment: Fulfillment,
): Expression {
  // If it's a Boolean / course expr, it gets wrapped in an OR.
  // Otherwise, we don't do anything at this stage.
  if (expr.$type === "course") {
    return wrapInOr(expr, fulfillment)
  }

  if (expr.$type === "boolean") {
    switch (expr.$booleanType) {
      case "or":
        expr._fulfillment = fulfillment
        expr.$or.push(fulfillment)
        break
      case "and":
        return wrapInOr(expr, fulfillment)
      default:
        // area files are parsed at runtime; leave unknown booleans alone
        break
    }
  }

  return expr
}
