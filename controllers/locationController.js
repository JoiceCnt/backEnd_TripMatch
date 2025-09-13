import axios from "axios";

export const getCountries = async (req, res) => {
  try {
    const response = await axios.get(
      `${process.env.EXTERNAL_API_BASE}/countries`,
      {
        headers: {
          "X-CSCAPI-KEY": process.env.EXTERNAL_API_KEY
        }
      }
    );

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching countries:", error.message);
    res.status(500).json({ error: "Failed to fetch countries" });
  }
};