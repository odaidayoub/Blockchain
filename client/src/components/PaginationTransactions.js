import React from 'react'
import Pagination from 'react-bootstrap/Pagination'

const PaginationTransactions = ({
  transactionsPerPage,
  totalTransactions,
  paginate,
}) => {
  const pageNumbers = []
  let active

  for (
    let i = 1;
    i <= Math.ceil(totalTransactions / transactionsPerPage);
    i++
  ) {
    pageNumbers.push(i)
  }

  return (
    <Pagination>
      {pageNumbers.map((number) => (
        <Pagination.Item key={number} active={number === active}>
          <a href='!#' onClick={() => paginate(number)} className='page-link'>
            {number}
          </a>
        </Pagination.Item>
      ))}
    </Pagination>
  )
}

export default PaginationTransactions
