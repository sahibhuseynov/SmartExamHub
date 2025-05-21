const express = require('express');
const app = express();
const gumroadWebhook = require('./gumroadWebhook');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.post('/api/gumroad-webhook', gumroadWebhook);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
