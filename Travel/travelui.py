<<<<<<< HEAD
import streamlit as st
import joblib
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, LabelEncoder, MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
import folium
from streamlit_folium import folium_static
from geopy.geocoders import Nominatim

# Load the model and encoders
model_path = 'D:/React_projects/Travel Mate project/Travel Mate project/Travel/travel_chatbot_model.pkl'
clf = joblib.load(model_path)

# Load and prepare dataset
df = pd.read_csv('Travelchatbots.csv')

# Initialize encoders
encoder = OneHotEncoder(sparse=False)
le_location = LabelEncoder()
le_accommodation = LabelEncoder()
le_address = LabelEncoder()
mlb_activities = MultiLabelBinarizer()

# Fit encoders
df['Location_encoded'] = le_location.fit_transform(df['Location'])
df['Accommodation_encoded'] = le_accommodation.fit_transform(df['Accommodation'])
df['Address_encoded'] = le_address.fit_transform(df['Address'])
df['Activities'] = df['Activities'].apply(lambda x: x.split(', '))
activities_encoded = mlb_activities.fit_transform(df['Activities'])
X_basic = df[['Weather', 'Traveltype', 'Perpersonbudget']]
X_encoded = encoder.fit_transform(X_basic)
X_final = pd.DataFrame(X_encoded)

# Create target variable `y` for recommendation purposes
y = pd.concat([df[['Location_encoded', 'Accommodation_encoded', 'Address_encoded']], pd.DataFrame(activities_encoded)], axis=1)

# Streamlit UI
st.title("Travel Recommendation System")

st.image('./data/Cover-Img.png')

# User input for travel preferences
st.subheader("Enter your travel preferences:")

weather_options = sorted(df['Weather'].unique())
travel_type_options = sorted(df['Traveltype'].unique())

user_weather = st.selectbox("Weather Preference:", weather_options)
user_traveltype = st.selectbox("Travel Type:", travel_type_options)
user_budget = st.slider("Per Person Budget (LKR):", min_value=1000, max_value=50000, step=1000)

# Recommendation Function
def recommend(user_input, num_recommendations=5):
    # Prepare user input (basic features)
    user_input_basic = [user_input[:3]]  # ['Hot', 'City life', 15000]

    # Encode user input
    user_input_basic_encoded = encoder.transform(user_input_basic)

    # Compute similarity between user input and dataset
    similarity_scores = cosine_similarity(user_input_basic_encoded, X_final).flatten()

    # Get top N most similar rows
    top_indices = similarity_scores.argsort()[-num_recommendations:][::-1]

    # Get recommendations
    recommendations = df.iloc[top_indices]

    # Decode the recommendations for display
    results = []
    for index, row in recommendations.iterrows():
        location_pred = le_location.inverse_transform([row['Location_encoded']])[0]
        accommodation_pred = le_accommodation.inverse_transform([row['Accommodation_encoded']])[0]
        address_pred = le_address.inverse_transform([row['Address_encoded']])[0]

        # Retrieve the activity information directly from the encoded activities
        activity_encoded = activities_encoded[index].reshape(1, -1)  # Convert to 2D array
        activities_pred = mlb_activities.inverse_transform(activity_encoded)[0]  # Decode activities

        results.append({
            'Location': location_pred,
            'Accommodation': accommodation_pred,
            'Address': address_pred,
            'Activities': ', '.join(activities_pred),
            'Similarity Score': similarity_scores[index]
        })

    return results

# Function to create and display a map
from geopy.exc import GeocoderUnavailable, GeocoderTimedOut

def display_map(address):
    geolocator = Nominatim(user_agent="travel_recommendation_app", timeout=10)
    
    try:
        location = geolocator.geocode(address)
        
        if location:
            # Create a map centered around the address location
            map_ = folium.Map(location=[location.latitude, location.longitude], zoom_start=15)
            # Add a marker to the location
            folium.Marker([location.latitude, location.longitude], tooltip=f"Location: {address}").add_to(map_)
            folium_static(map_)
        else:
            st.write("Address not found. Unable to display map.")
    
    except (GeocoderUnavailable, GeocoderTimedOut):
        st.write("Geocoding service is unavailable or timed out. Please try again later.")


# Button to get recommendations
if st.button("Get Recommendations"):
    # Example user input
    user_input = [user_weather, user_traveltype, user_budget]
    
    # Get recommendations
    recommendations = recommend(user_input, num_recommendations=10)

    st.subheader("Top 10 Travel Recommendations:")
    for i, rec in enumerate(recommendations, 1):
        st.markdown(f"**Recommendation {i}:**")
        st.write(f"**Location:** {rec['Location']}")
        st.write(f"**Accommodation:** {rec['Accommodation']}")
        st.write(f"**Address:** {rec['Address']}")
        st.write(f"**Activities:** {rec['Activities']}")
        # Display the map for the address
        display_map(rec['Address'])
        st.write("---")

import streamlit as st
import webbrowser

# Example button for returning to the dashboard
if st.button('Return to Dashboard'):
    # Open the dashboard URL in a new tab
    webbrowser.open('http://localhost:3000/dashboard')

    # Set a flag in session state (for demonstration purposes; not actual redirection)
=======
import streamlit as st
import joblib
import pandas as pd
from sklearn.preprocessing import OneHotEncoder, LabelEncoder, MultiLabelBinarizer
from sklearn.metrics.pairwise import cosine_similarity
import folium
from streamlit_folium import folium_static
from geopy.geocoders import Nominatim

# Load the model and encoders
model_path = 'D:/React_projects/Travel Mate project/Travel Mate project/Travel/travel_chatbot_model.pkl'
clf = joblib.load(model_path)

# Load and prepare dataset
df = pd.read_csv('Travelchatbots.csv')

# Initialize encoders
encoder = OneHotEncoder(sparse=False)
le_location = LabelEncoder()
le_accommodation = LabelEncoder()
le_address = LabelEncoder()
mlb_activities = MultiLabelBinarizer()

# Fit encoders
df['Location_encoded'] = le_location.fit_transform(df['Location'])
df['Accommodation_encoded'] = le_accommodation.fit_transform(df['Accommodation'])
df['Address_encoded'] = le_address.fit_transform(df['Address'])
df['Activities'] = df['Activities'].apply(lambda x: x.split(', '))
activities_encoded = mlb_activities.fit_transform(df['Activities'])
X_basic = df[['Weather', 'Traveltype', 'Perpersonbudget']]
X_encoded = encoder.fit_transform(X_basic)
X_final = pd.DataFrame(X_encoded)

# Create target variable `y` for recommendation purposes
y = pd.concat([df[['Location_encoded', 'Accommodation_encoded', 'Address_encoded']], pd.DataFrame(activities_encoded)], axis=1)

# Streamlit UI
st.title("Travel Recommendation System")

st.image('./data/Cover-Img.png')

# User input for travel preferences
st.subheader("Enter your travel preferences:")

weather_options = sorted(df['Weather'].unique())
travel_type_options = sorted(df['Traveltype'].unique())

user_weather = st.selectbox("Weather Preference:", weather_options)
user_traveltype = st.selectbox("Travel Type:", travel_type_options)
user_budget = st.slider("Per Person Budget (LKR):", min_value=1000, max_value=50000, step=1000)

# Recommendation Function
def recommend(user_input, num_recommendations=5):
    # Prepare user input (basic features)
    user_input_basic = [user_input[:3]]  # ['Hot', 'City life', 15000]

    # Encode user input
    user_input_basic_encoded = encoder.transform(user_input_basic)

    # Compute similarity between user input and dataset
    similarity_scores = cosine_similarity(user_input_basic_encoded, X_final).flatten()

    # Get top N most similar rows
    top_indices = similarity_scores.argsort()[-num_recommendations:][::-1]

    # Get recommendations
    recommendations = df.iloc[top_indices]

    # Decode the recommendations for display
    results = []
    for index, row in recommendations.iterrows():
        location_pred = le_location.inverse_transform([row['Location_encoded']])[0]
        accommodation_pred = le_accommodation.inverse_transform([row['Accommodation_encoded']])[0]
        address_pred = le_address.inverse_transform([row['Address_encoded']])[0]

        # Retrieve the activity information directly from the encoded activities
        activity_encoded = activities_encoded[index].reshape(1, -1)  # Convert to 2D array
        activities_pred = mlb_activities.inverse_transform(activity_encoded)[0]  # Decode activities

        results.append({
            'Location': location_pred,
            'Accommodation': accommodation_pred,
            'Address': address_pred,
            'Activities': ', '.join(activities_pred),
            'Similarity Score': similarity_scores[index]
        })

    return results

# Function to create and display a map
def display_map(address):
    geolocator = Nominatim(user_agent="travel_recommendation_app")
    location = geolocator.geocode(address)
    
    if location:
        # Create a map centered around the address location
        map_ = folium.Map(location=[location.latitude, location.longitude], zoom_start=15)
        # Add a marker to the location
        folium.Marker([location.latitude, location.longitude], tooltip=f"Location: {address}").add_to(map_)
        folium_static(map_)
    else:
        st.write("Address not found. Unable to display map.")

# Button to get recommendations
if st.button("Get Recommendations"):
    # Example user input
    user_input = [user_weather, user_traveltype, user_budget]
    
    # Get recommendations
    recommendations = recommend(user_input, num_recommendations=10)

    st.subheader("Top 10 Travel Recommendations:")
    for i, rec in enumerate(recommendations, 1):
        st.markdown(f"**Recommendation {i}:**")
        st.write(f"**Location:** {rec['Location']}")
        st.write(f"**Accommodation:** {rec['Accommodation']}")
        st.write(f"**Address:** {rec['Address']}")
        st.write(f"**Activities:** {rec['Activities']}")
        # Display the map for the address
        display_map(rec['Address'])
        st.write("---")

import streamlit as st
import webbrowser

# Example button for returning to the dashboard
if st.button('Return to Dashboard'):
    # Open the dashboard URL in a new tab
    webbrowser.open('http://localhost:3000/dashboard')

    # Set a flag in session state (for demonstration purposes; not actual redirection)
>>>>>>> origin/master
    st.session_state.redirect_to_dashboard = True