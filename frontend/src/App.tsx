import { useEffect } from "react"
import { api } from "./lib/api";

function App() {
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await api('/tasks', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            // Authorization: `Bearer ${localStorage.getItem('token')}`,
            Authorization: `Bearer ${import.meta.env.VITE_TOKEN_TEST}`, // testes
          },
        });
        console.log(data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])
  

  return (
    <div>
      <h1>Manto Sistemas FullStack Test</h1>
    </div>
  )
}

export default App
