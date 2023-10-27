const swaggerUi = require('swagger-ui-express');
const CSS_URL = "https://cdnjs.cloudflare.com/ajax/libs/swagger-ui/4.1.0/swagger-ui.min.css";
const fs = require("fs");
const path = require('path');
const YAML = require('yaml');

docs = app => {
    const file  = fs.readFileSync(path.join(__dirname, "../../public/api.yaml"), 'utf8');
    const swaggerDocument = YAML.parse(file);
    
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument,  { customCssUrl: CSS_URL }));
}

module.exports = { docs }