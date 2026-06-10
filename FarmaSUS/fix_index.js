const { execSync } = require('child_process');
const fs = require('fs');
let content = execSync('git show ":0:app/(tabs)/index.tsx"', { encoding: 'utf8' });

content = content.replace('import React, { useState, useEffect } from "react";', 'import { useFocusEffect } from "expo-router";\nimport React, { useState, useCallback } from "react";');

content = content.replace(/useEffect\(\(\) => \{[\s\S]*?\}, \[\]\);/, 
  `useFocusEffect(
    useCallback(() => {
      async function loadMedications() {
        try {
          const response = await api.get('/medications');
          setMedications(response.data);
        } catch (error) {
          console.log('Erro ao buscar medicamentos', error);
        }
      }
      loadMedications();
    }, [])
  );`
);

content = content.replace(/console\.error\(/g, 'console.log(');

fs.writeFileSync('frontend/app/(tabs)/index.tsx', content, 'utf8');
console.log('Done!');
