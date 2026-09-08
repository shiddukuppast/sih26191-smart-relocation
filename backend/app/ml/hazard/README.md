# Hazard Prediction Models

This directory contains the trained machine learning models used by
the SIH26191 hazard prediction engine.

## Models

### Flood Model

File:

`flood_model.pkl`

The flood model predicts the `hazard_label` for a given location.

### Landslide Model

File:

`landslide_model.pkl`

The landslide model predicts the `hazard_label` for a given location.

## Input Features

Both models use the following 10 features:

1. `rainfall_24h_mm`
2. `rainfall_7d_mm`
3. `slope_deg`
4. `elevation_m`
5. `land_use`
6. `distance_to_river_m`
7. `soil_type`
8. `historical_landslide_count`
9. `historical_flood_count`
10. `built_up_percentage`

## Preprocessing

The models were trained using a scikit-learn pipeline containing:

- `StandardScaler` for numerical features
- `OneHotEncoder(handle_unknown="ignore")` for categorical features
- `RandomForestClassifier`

The preprocessing pipeline is already stored inside each `.pkl` model.

Therefore, the backend should pass the raw feature values to the saved pipeline and should not manually apply scaling or one-hot encoding.

## Output

The models predict:

`hazard_label`

Current classes:

```text
0
1
2
3
4