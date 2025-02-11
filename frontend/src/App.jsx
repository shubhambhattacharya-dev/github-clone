import { Route } from "react-router-dom"



function App() {


  return (
    <div className="flex">
      <sidebar>
        <div>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/explore" element={<ExplorePage />} />
            <Route path="/likes" element={<LikesPage />} />


          </Routes>
        </div>
      </sidebar>

     
    </div>
  )
}

export default App
