const reconcileOrder = (existingBook, incomingOrder) => {
  const oppositeOrders = existingBook.filter(order => order.type !== incomingOrder.type)
  let updatedBook = existingBook.filter(order => order.type === incomingOrder.type)

  updatedBook = existingBook.length ? updatedBook.concat(fillOrAddOrder(oppositeOrders, incomingOrder))
    : updatedBook.concat(incomingOrder)

  return updatedBook
}

const fillOrAddOrder = (existing, incoming) => {
  const index = incoming.type === 'sell'
    ? existing.findIndex(order => order.price >= incoming.price)
    : existing.findIndex(order => order.price <= incoming.price)

  return index < 0 ? existing.concat(incoming)
    : matchQuantities(existing, incoming, index)
}

const matchQuantities = (existing, incoming, index) => {
  if (existing[index].quantity === incoming.quantity) {
    existing.splice(index, 1)
    return existing
  } else if (existing[index].quantity > incoming.quantity) {
    existing[index].quantity -= incoming.quantity
    return existing
  } else if (existing[index].quantity < incoming.quantity) {
    incoming.quantity -= existing[index].quantity
    existing.splice(index, 1)
    return fillOrAddOrder(existing, incoming)
  }
}

module.exports = reconcileOrder
