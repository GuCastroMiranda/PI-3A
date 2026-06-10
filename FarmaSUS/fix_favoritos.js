const { execSync } = require('child_process');
const fs = require('fs');
let content = execSync('git show ":0:app/(tabs)/Favoritos.tsx"', { encoding: 'utf8' });

// Add imports
content = content.replace('import React, { useState, useEffect } from \'react\';', 'import { useFocusEffect } from \"expo-router\";\nimport React, { useState, useCallback } from \'react\';');

// Replace useEffect
content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[token\]\);/, 
  `useFocusEffect(
    useCallback(() => {
      async function loadMedications() {
        try {
          const response = await api.get('/medications');
          setMedications(response.data);
        } catch (error) {
          console.log('Erro ao buscar medicamentos nos favoritos:', error);
        }
      }
      loadMedications();
    }, [token])
  );`
);

// Fix console.error
content = content.replace(/console\.error\(/g, 'console.log(');

fs.writeFileSync('frontend/app/(tabs)/Favoritos.tsx', content, 'utf8');
console.log('Done!');
