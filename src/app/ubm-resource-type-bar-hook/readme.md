# ubm-resource-type-bar-hook

Composant invisible qui intercepte les clics sur la barre `nde-search-results-resource-type-bar`
pour remplacer le comportement natif Primo (`pfilter=rtype,exact,X&mode=resourceTypeFilterBar`)
par un facet standard (`facet=rtype,include,X`).

---

## Comportement

| Clic | URL produite par Primo (natif) | URL produite par ce composant |
|---|---|---|
| `Bandes dessinées` | `pfilter=rtype,exact,comic&mode=resourceTypeFilterBar` | `facet=rtype,include,comic` |
| `Livres` | `pfilter=rtype,exact,books&mode=...` | `facet=rtype,include,books` |
| `Tout` | supprime le pfilter | supprime tous les `facet=rtype,*` |

Les autres facets actifs (disponibilité, etc.) sont préservés.

---

## Intégration

### 1. Copier le composant

Placer `ubm-resource-type-bar-hook.component.ts` dans :
```
src/app/ubm-resource-type-bar-hook/
```

### 2. Enregistrer dans customComponentMappings.ts

```typescript
import { UbmResourceTypeBarHookComponent } from './ubm-resource-type-bar-hook/ubm-resource-type-bar-hook.component';

export const selectorComponentMap = new Map<string, any>([
  // ... vos autres composants ...
  ['nde-search-results-resource-type-bar-before', UbmResourceTypeBarHookComponent],
]);
```

Le suffixe `-before` place le composant juste avant la barre native.
Vous pouvez aussi utiliser `-after` si vous préférez.

### 3. Vérifier le chemin du SHELL_ROUTER

Dans le composant, ajustez l'import si nécessaire :
```typescript
import { SHELL_ROUTER } from '../../injection-tokens';
//                            ^^ chemin relatif depuis votre dossier
```

---

## Pourquoi SHELL_ROUTER et pas Router ?

La doc ExLibris recommande d'utiliser `SHELL_ROUTER` (token NDE) plutôt que le `Router`
Angular standard, pour s'assurer que la navigation passe bien par le routeur de l'application
hôte Primo et non par un éventuel routeur enfant isolé.

---

## Compatibilité

- NDE December 2025+
- Angular standalone components ✓
- Pas de dépendance externe au-delà de `@angular/core` et `rxjs`