import "./App.css";
import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/index";
import {
  LoginPage,
  RegisterPage,
  IndexPage,
  PlacesPage,
  BookingsPage,
  PlaceFormPage,
  OnePlacePage,
} from "./pages/index";
import axios from "axios";
import { UserContextProvider } from "./user.context";
import AccountPage from "./pages/AccountPage";

axios.defaults.baseURL = "http://localhost:3000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <UserContextProvider>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<IndexPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<AccountPage />} />
          <Route path="/account/places" element={<PlacesPage />} />
          <Route path="/account/places/:id" element={<PlaceFormPage />} />
          <Route path="/account/places/new" element={<PlaceFormPage />} />
          <Route path="/places/:id" element={<OnePlacePage />} />
          <Route path="/account/bookings" element={<BookingsPage />} />
        </Route>
      </Routes>
    </UserContextProvider>
  );
}

export default App;
