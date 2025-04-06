import { type NextRequest, NextResponse } from "next/server"
import { MongoClient, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI || "mongodb://localhost:27017"
const client = new MongoClient(uri)
const dbName = "scrapbook_db"
const collectionName = "entries"

export async function GET() {
  try {
    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    const entries = await collection.find({}).toArray()

    return NextResponse.json(
      entries.map((entry) => ({
        ...entry,
        _id: entry._id.toString(),
      })),
    )
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch entries" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    const result = await collection.insertOne({
      ...data,
      createdAt: new Date(),
    })

    return NextResponse.json({ id: result.insertedId.toString() })
  } catch (error) {
    return NextResponse.json({ error: "Failed to create entry" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { id, ...data } = await request.json()

    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    await collection.updateOne({ _id: new ObjectId(id) }, { $set: { ...data, updatedAt: new Date() } })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to update entry" }, { status: 500 })
  } finally {
    await client.close()
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json()

    await client.connect()
    const db = client.db(dbName)
    const collection = db.collection(collectionName)

    await collection.deleteOne({ _id: new ObjectId(id) })

    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Failed to delete entry" }, { status: 500 })
  } finally {
    await client.close()
  }
}

