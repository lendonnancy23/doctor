import { MongoClient } from 'mongodb'

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongo URI to .env.local')
}

const uri = process.env.MONGODB_URI
const options = {
  maxPoolSize: 10,
  minPoolSize: 0,
  retryWrites: true,
  w: 1,
  monitorCommands: true,
  connectTimeoutMS: 5000, // 5 second timeout
  socketTimeoutMS: 5000,
  serverSelectionTimeoutMS: 5000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

// For Edge Runtime - simplified connection handling
if (process.env.NEXT_RUNTIME === 'edge') {
  client = new MongoClient(uri, {
    ...options,
    maxPoolSize: 1, // Reduce pool size for edge
    minPoolSize: 0
  });
  clientPromise = client.connect()
    .catch(error => {
      console.error('Edge MongoDB connection error:', error)
      throw new Error('Database connection failed in edge runtime.')
    });
} else if (process.env.NODE_ENV === 'development') {
  let globalWithMongo = global as typeof globalThis & {
    _mongoClientPromise?: Promise<MongoClient>
  }

  if (!globalWithMongo._mongoClientPromise) {
    client = new MongoClient(uri, options)
    globalWithMongo._mongoClientPromise = client.connect()
      .then(client => {
        client.on('timeout', () => {
          console.error('MongoDB operation timeout')
        })
        client.on('error', (error) => {
          console.error('MongoDB connection error:', error)
        })
        return client
      })
      .catch(error => {
        console.error('MongoDB connection error:', error)
        throw new Error('Failed to connect to MongoDB. Please check your connection.')
      })
  }
  clientPromise = globalWithMongo._mongoClientPromise
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
    .then(client => {
      client.on('timeout', () => {
        console.error('MongoDB operation timeout')
      })
      client.on('error', (error) => {
        console.error('MongoDB connection error:', error)
      })
      return client
    })
    .catch(error => {
      console.error('MongoDB connection error:', error)
      throw new Error('Database connection failed. Our team has been notified.')
    })
}

export { clientPromise }
