import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import ErrorAlert from "../layout/ErrorAlert";
import { createTable } from "../utils/api";

export default function NewTable({ setRerender }) {
  const history = useHistory();

  const [error, setError] = useState(null);

  const [formData, setFormData] = useState({
    // initial (default) data
    table_name: "",
    capacity: null,
  });

  function handleChange({ target }) {
    setFormData({ ...formData, [target.name]: target.value });
	if(target.name === "capacity") setFormData({ ...formData,[target.name]: parseInt(target.value)});
  }

  function handleSubmit(event) {
    event.preventDefault();
    const abortController = new AbortController();
    if (validateFields()) {
      createTable(formData, abortController.signal)
        .then((resp) => setRerender(true))
        .catch(console.error);
      history.push(`/dashboard`);
    }
  }

  function validateFields() {
    let foundError = null;

    if (formData.table_name === "" || formData.capacity === null) {
      foundError = { message: "Please fill out all fields." };
    } else if (formData.table_name.length < 2) {
      foundError = { message: "Table name must be at least 2 characters." };
    }

    setError(foundError);

    return foundError === null;
  }

  return (
    <form>
      <ErrorAlert error={error} />

      <label htmlFor="table_name">Table Name:&nbsp;</label>
      <input
        name="table_name"
        id="table_name"
        type="text"
        minLength="2"
        onChange={handleChange}
        value={formData.table_name}
        required
      />

      <label htmlFor="capacity">Capacity:&nbsp;</label>
      <input
        name="capacity"
        id="capacity"
        type="number"
        min="1"
        onChange={handleChange}
        value={formData.capacity}
        required
      />

      <button type="submit" onClick={handleSubmit}>
        Submit
      </button>
      <button type="button" onClick={history.goBack}>
        Cancel
      </button>
    </form>
  );
}
