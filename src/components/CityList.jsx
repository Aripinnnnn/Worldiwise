import CityItem from "./CityItem";
import styles from "./CityList.module.css";
import Spinner from "./Spinner";
import Message from "./Message";
import { useCities } from "../contexts/CitiesContext";

export default function CityList() {
  const {cities, isLoading} = useCities();
  
  if (isLoading) return <Spinner />;

  if(!cities.length) return <Message message='Add your first city by clicking a city on a map'/>

  return (
    <ul className={styles.cityList}>
      {cities.map((city) => (
        <CityItem city={city} key={city.id} />
      ))}
    </ul>
  );
}

