import React from 'react'
import Table from 'react-bootstrap/Table'

const Transactions = ({ transactions }) => {
  return (
    <Table striped bordered hover responsive className='table-sm'>
      <thead>
        <tr>
          <th>
            <h4>Data</h4>
          </th>
        </tr>
      </thead>
      <tbody>
        {transactions.map((transaction, index) => (
          <tr key={index}>
            <td>{transaction}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}

export default Transactions
