import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns
import numpy as np
import os
import tensorflow as tf
from sklearn.preprocessing import MinMaxScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score
import keras
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, LSTM, Conv1D, Lambda
from tensorflow.keras.losses import Huber
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping, ModelCheckpoint
from datetime import datetime
from dateutil.relativedelta import *


# plt.rcParams['font.family']= "AppleGothic"
# plt.rcParams['figure.figsize']=(8,6)
# plt.rcParams['axes.unicode_minus']=False

#데이터 불러오기
data = pd.read_excel('./routes/api/predict/test.xlsx')

# power_data = pd.DataFrame(data)
# power_data = power_data['시간별전력']
# plt.figure(figsize=(16,9))
# plt.title('IoT 전력사용량')
# plt.ylabel('전력사용량')
# plt.xlabel('날짜')
# plt.plot(power_data, label='실제 사용량')
# plt.grid()
# plt.legend(loc='best')


# plt.show()

scaler = MinMaxScaler()

feature_cols = ['기온(°C)','풍속(m/s)','습도(%)','미세먼지','불쾌지수','지하철이용자수']
label_cols = ['시간별전력']

feature_data = data[feature_cols]
label_data = data[label_cols]

feature_scaled_df = scaler.fit_transform(feature_data)
feature_scaled_df = pd.DataFrame(feature_scaled_df, columns=feature_cols)
feature_scaled_df.index = data['MSSAGE_STRE_DT']


label_scaled_df = scaler.fit_transform(data[label_cols])
label_scaled_df = pd.DataFrame(label_scaled_df, columns=label_cols)
label_scaled_df.index = data['MSSAGE_STRE_DT']

#독립변수 정규화데이터 성 및 np로 변경
feature_np = feature_scaled_df.to_numpy()

# #종속변수 정규화데이터 생성 및 np로 변경
label_np = label_scaled_df.to_numpy()

window_size =168

def make_dataset(feature, label, window_size):
    feature_list = []
    label_list = []
    
    for i in range(len(feature)-window_size):
        feature_list.append(feature[i:i+window_size])
        label_list.append(label[i+window_size])
    
    return np.array(feature_list),np.array(label_list)
        

X,Y = make_dataset(feature_np, label_np, window_size)

rate = (28*24)/len(X)
x_train,x_test,y_train,y_test = train_test_split(X,Y,test_size=rate,random_state=42,shuffle=False)

#x_train.shape, x_test.shape

model = Sequential()

model.add(LSTM(128,
              activation='tanh',
              input_shape=x_train[0].shape))

model.add(Dense(1, activation='linear'))
model.compile(loss='mse', optimizer='adam', metrics=['mae'])
#model.summary()

early_stop = EarlyStopping(monitor='val_loss',patience=5)
# history = model.fit(x_train, y_train, validation_data=(x_test, y_test), epochs=50,batch_size=24,callbacks=[early_stop])
history = model.fit(x_train, y_train, validation_data=(x_test, y_test), epochs=50,batch_size=24,callbacks=[early_stop], verbose =0)

# plt.figure(figsize=(12, 4))
# plt.title('LSTM Model Test ', fontsize= 15)

# plt.subplot(1, 2, 1)
# plt.title('loss of LSTM Model ', fontsize= 15)
# plt.plot(history.history['loss'], 'b-', label='loss')
# plt.xlabel('Epoch')
# plt.legend()

#예측결과그래프

pred = model.predict(x_test)

#사용자에게 제공해야할 데이터 : predBack!
pred_df = pd.DataFrame(pred)
predBack = scaler.inverse_transform(pred_df)
predBack = pd.DataFrame(predBack)

result = []
sum = 0
count = 0
for i in predBack[0]:
    sum += i
    count+=1
    if(count == 24):
        result.append(sum)
        sum = 0
        count = 0


print(result)




# print_list = predBack.values.tolist()
# print(print_list)
# *print_list, sep = ','