# Room Management Workflow

## Step 1: Fetch Hostels for Dropdown

**Endpoint:** `GET /hostel/dropdown/list`

**Optional Query Parameters:**
- `owner` - Filter by owner ID (optional)

**Example Request:**
```
GET http://localhost:4000/hostel/dropdown/list?owner=507f1f77bcf86cd799439011
```

**Example Response:**
```json
[
  {
    "_id": "674e5b1d093605bc4a88e050",
    "name": "Grand Hostel",
    "city": "New York",
    "area": "Manhattan",
    "location": "Downtown"
  },
  {
    "_id": "674e5ca585860f9b641a67f16",
    "name": "Sunrise Hostel",
    "city": "Los Angeles",
    "area": "Hollywood",
    "location": "Central"
  }
]
```

## Step 2: User Selects Hostel from Dropdown

The frontend should display the hostels in a dropdown/select component using the data from Step 1.
When user selects a hostel, capture the `_id` value.

## Step 3: Create Room with Selected Hostel ID

**Endpoint:** `POST /rooms`

**Headers:**
```
Authorization: Bearer <your-jwt-token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "hostelId": "674e5b1d093605bc4a88e050",
  "roomNumber": "101",
  "type": "Single",
  "capacity": 2,
  "price": 50,
  "available": true,
  "description": "Spacious room with city view",
  "amenities": ["WiFi", "AC", "TV"],
  "floor": 1,
  "images": ["https://example.com/room1.jpg"]
}
```

**Response:**
```json
{
  "_id": "674e6d2a123456789abcdef0",
  "hostelId": "674e5b1d093605bc4a88e050",
  "roomNumber": "101",
  "type": "Single",
  "capacity": 2,
  "price": 50,
  "available": true,
  "description": "Spacious room with city view",
  "amenities": ["WiFi", "AC", "TV"],
  "floor": 1,
  "images": ["https://example.com/room1.jpg"],
  "createdAt": "2024-12-01T10:30:00.000Z",
  "updatedAt": "2024-12-01T10:30:00.000Z"
}
```

## Step 4: View Rooms by Hostel

**Endpoint:** `GET /rooms/hostel/:hostelId`

**Example Request:**
```
GET http://localhost:4000/rooms/hostel/674e5b1d093605bc4a88e050
```

**Response:**
```json
[
  {
    "_id": "674e6d2a123456789abcdef0",
    "hostelId": "674e5b1d093605bc4a88e050",
    "roomNumber": "101",
    "type": "Single",
    "capacity": 2,
    "price": 50,
    "available": true,
    "description": "Spacious room with city view",
    "amenities": ["WiFi", "AC", "TV"],
    "floor": 1,
    "images": ["https://example.com/room1.jpg"]
  },
  {
    "_id": "674e6d2a123456789abcdef1",
    "hostelId": "674e5b1d093605bc4a88e050",
    "roomNumber": "102",
    "type": "Double",
    "capacity": 4,
    "price": 80,
    "available": true
  }
]
```

## Frontend Implementation Example (React)

```javascript
// Step 1: Fetch hostels for dropdown
const [hostels, setHostels] = useState([]);
const [selectedHostelId, setSelectedHostelId] = useState('');

useEffect(() => {
  fetch('http://localhost:4000/hostel/dropdown/list')
    .then(res => res.json())
    .then(data => setHostels(data));
}, []);

// Step 2: Dropdown component
<select 
  value={selectedHostelId} 
  onChange={(e) => setSelectedHostelId(e.target.value)}
>
  <option value="">Select a Hostel</option>
  {hostels.map(hostel => (
    <option key={hostel._id} value={hostel._id}>
      {hostel.name} - {hostel.city}
    </option>
  ))}
</select>

// Step 3: Create room with selected hostelId
const createRoom = async (roomData) => {
  const response = await fetch('http://localhost:4000/rooms', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      ...roomData,
      hostelId: selectedHostelId
    })
  });
  return response.json();
};
```

## Additional Useful Endpoints

### Get Available Rooms by Hostel
```
GET /rooms/hostel/:hostelId/available
```

### Update Room
```
PUT /rooms/:roomId
Authorization: Bearer <token>
```

### Update Room Availability
```
PUT /rooms/:roomId/availability?available=false
Authorization: Bearer <token>
```

### Delete Room
```
DELETE /rooms/:roomId
Authorization: Bearer <token>
```
