import { useCallback, useEffect, useState } from 'react'
import { ethers } from 'ethers'
import Header from '../components/Header'
import Transactions from '../components/Transactions'
import PaginationTransactions from '../components/PaginationTransactions'
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Form from 'react-bootstrap/Form'
import Col from 'react-bootstrap/Col'
import Button from 'react-bootstrap/Button'
import { contractAddress, contractABI } from '../constants/contractConstants'

const Home = () => {
  const [walletAddress, setWalletAddress] = useState('')
  const [transactions, setTransactions] = useState([])
  const [show, setShow] = useState(false)
  const [data, setData] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [transactionsPerPage] = useState(6)

  //  Connect to the Metamask by my account
  const connectWallet = async () => {
    if (typeof window != 'undefined' && typeof window.ethereum != 'undefined') {
      try {
        /* MetaMask is installed then connect */
        const accounts = await window.ethereum.request({
          method: 'eth_requestAccounts',
        })
        setWalletAddress(accounts[0])
      } catch (err) {
        console.error(err.message)
      }
    } else {
      /* MetaMask is not installed */
      console.log('Please install MetaMask')
    }
  }

  //  Get Connected Account Wallet
  const getCurrentWalletConnected = useCallback(async () => {
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_accounts',
      })
      setWalletAddress(accounts[0])
    } catch (err) {
      console.error(err.message)
    }
  }, [])

  //  Get Transactions from Smart Contract which I interact with
  const getTransactions = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      const contractTransactions = await contract.retrieve()
      setTransactions(contractTransactions)
    } catch (err) {
      console.error(err.message)
    }
  }

  //  Write on chain of Smart Contract which  I interact with
  const writeDataOnChain = async (data) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const contract = new ethers.Contract(contractAddress, contractABI, signer)
      let tx = await contract.store(data)
      await tx.wait()
      if (tx) {
        getTransactions()
      }
    } catch (err) {
      console.error(err.message)
    }
  }

  const submitHandler = async (e) => {
    e.preventDefault()
    writeDataOnChain(data)
  }

  useEffect(() => {
    getCurrentWalletConnected()
  }, [getCurrentWalletConnected])

  // Get current Transactions
  const indexOfLastTransaction = currentPage * transactionsPerPage
  const indexOfFirstTransaction = indexOfLastTransaction - transactionsPerPage
  const currentTransactions = [...transactions]
    .reverse()
    .slice(indexOfFirstTransaction, indexOfLastTransaction)

  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber)

  return (
    <>
      <Header address={walletAddress} />
      <Container fluid>
        <Row className='align-items-center'>
          <Col md={4}>
            <h1>Storage</h1>
          </Col>
          <Col md={{ span: 4, offset: 4 }}>
            {!walletAddress ? (
              <Button className='my-3' variant='danger' onClick={connectWallet}>
                Connect Metamask
              </Button>
            ) : (
              <Button
                className='my-3'
                md={{ span: 4, offset: 4 }}
                variant='info'
                onClick={getTransactions}
              >
                Get Transaction
              </Button>
            )}
          </Col>
        </Row>
      </Container>
      {transactions && (
        <>
          <Transactions transactions={currentTransactions} />
          <PaginationTransactions
            transactionsPerPage={transactionsPerPage}
            totalTransactions={transactions.length}
            paginate={paginate}
          />
        </>
      )}
      {walletAddress && (
        <Button className='my-3' variant='info' onClick={() => setShow(true)}>
          Write on chain
        </Button>
      )}
      {show && (
        <div className='rounded bg-light bg-gradient p-4 w-50'>
          <Container className='rounded'>
            <Form onSubmit={submitHandler}>
              <Form.Group className='mb-3'>
                <Row>
                  <Form.Text className='text-muted fs-1 border-bottom'>
                    Write Data OnChain
                  </Form.Text>
                </Row>
                <Row>
                  <Form.Label className='fs-4 mt-3'>Data</Form.Label>
                </Row>
                <Row>
                  <Form.Control
                    className='border-bottom'
                    onChange={(e) => setData(e.target.value)}
                    type='text'
                    placeholder='Enter data'
                  />
                </Row>
              </Form.Group>
              <Row xs={2} md={4} lg={6}>
                <Col>
                  <Button className='btn-sm' variant='info' type='submit'>
                    Submit
                  </Button>
                </Col>
                <Col>
                  <Button
                    className='btn-sm'
                    variant='danger'
                    onClick={() => {
                      setShow(false)
                    }}
                  >
                    Cancel
                  </Button>
                </Col>
              </Row>
            </Form>
          </Container>
        </div>
      )}
    </>
  )
}

export default Home
