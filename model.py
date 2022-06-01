import pandas as pd
from sklearn.cluster import KMeans
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import joblib
from datetime import date
import datetime
import calendar
from collections import defaultdict

def getCrimeWeight(lat_lng_arr):
    # sample input dataframe
    curr_date = date.today()

    day = calendar.day_name[curr_date.weekday()]
    hour = datetime.datetime.now().hour

    data = {
        'DayOfWeek': [day] * len(lat_lng_arr),
        'Time': [hour] * len(lat_lng_arr),
        'X': [location['lat'] for location in lat_lng_arr],
        'Y': [location['lng'] for location in lat_lng_arr]
    }

    sample_df = pd.DataFrame(data)
    sample_df.loc[sample_df['DayOfWeek'] == 'Saturday', 'DayOfWeek'] = 1
    sample_df.loc[sample_df['DayOfWeek'] == 'Friday', 'DayOfWeek'] = 1
    sample_df.loc[sample_df['DayOfWeek'] != 1, 'DayOfWeek'] = 0

    df = pd.read_csv('processed_data.csv', index_col=0)
    df = df.reset_index(drop=True)
    geo_df = df[['X', 'Y']]

    from sklearn.preprocessing import StandardScaler
    s_geo_df = pd.DataFrame(StandardScaler().fit_transform(geo_df), columns=['X', 'Y'])

    # final model with scalar data
    kmeans = KMeans(n_clusters = 6, init = 'k-means++', random_state = 1024)
    model = kmeans.fit(s_geo_df)

    test_df = sample_df[['X', 'Y']]
    s_test_df = pd.DataFrame(StandardScaler().fit_transform(test_df), columns=['X', 'Y'])

    cluster = model.predict(s_test_df)

    tmp_df = pd.DataFrame(cluster, columns=['cluster'])
    result_df = pd.concat([sample_df,tmp_df], axis=1)

    test_df = result_df[['DayOfWeek', 'Time', 'cluster']]

    df = pd.read_csv('clustered_data.csv', index_col=0) # you also need this dataframe(is in github main)
    df = df[['DayOfWeek', 'Time', 'crime_weight', 'cluster']]
    df[['cluster']] = df[['cluster']].astype(str)
    df.loc[df['DayOfWeek'] == 'Saturday', 'DayOfWeek'] = 1
    df.loc[df['DayOfWeek'] == 'Friday', 'DayOfWeek'] = 1
    df.loc[df['DayOfWeek'] != 1, 'DayOfWeek'] = 0
    
    X_df, y_df = df.copy().drop(columns='crime_weight'), df['crime_weight']

    from sklearn.ensemble import RandomForestRegressor

    model = RandomForestRegressor(criterion = 'squared_error', min_samples_split = 2, random_state = 1024)
    model.fit(X_df, y_df)
    y_test_pred = model.predict(test_df)

    tmp_df = pd.DataFrame(y_test_pred, columns=['crime_weight'])
    result_df = pd.concat([result_df,tmp_df], axis=1)
    crime_result = result_df.to_numpy()
    crime_result = crime_result.tolist()

    crimeWeightMap = defaultdict(list) #key: cluster, value: crime weight
    clusterLength = len(crime_result)
    for data in crime_result:
        crimeWeightMap[data[4]].append(data[5])
    
    crimeScore = 0.0
    for cluster, crime in crimeWeightMap.items():
        crimeScore += (sum(crime) / len(crime))
    
    overallCrimeScore = crimeScore / len(crimeWeightMap)
    print(overallCrimeScore)
    crimeLevel = ((overallCrimeScore - 10.0)/1)*20
    if crimeLevel < 0:
        crimeLevel = 0.1
    if crimeLevel > 5:
        crimeLevel = 5

    return crimeLevel

    


