// hooks/ useUsers

import { useEffect, useState } from "react";
import { getUsers } from "../services/users";

export function useUsers() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    getUsers().then(setUsers);
  }, []);

  return users;
}
