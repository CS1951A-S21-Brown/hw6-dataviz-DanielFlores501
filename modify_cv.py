#!/usr/bin/env python

import numpy as np
import json
import pandas as pd
from collections import defaultdict

def main():
    df = pd.read_csv("./data/video_games.csv")
    df = topGamesAllTime(df) #11
    df = topGenrePerRegion(df) #12, 13,14,15
    df = publisherPerGenre(df) #...
    print(df)
    df.to_csv(r'./data/modified_video_games2.csv', index = False)

def topGamesAllTime(df):
    perRegionRank = []
    topGamesAllTime = []
    gs_df = df.sort_values("Global_Sales", 0, False)
    for d in range(len(df.loc[:,"Global_Sales"])):
        if(d < 10):
            topGamesAllTime.append(gs_df.loc[:,"Rank"][d])
    #print("topGamesAllTime")
    #print(topGamesAllTime)
    #df = pd.concat([df, pd.DataFrame(topGamesAllTime)], ignore_index=True, axis=1)
    df["topGamesAllTime"] = pd.DataFrame(topGamesAllTime)
    return df

def topGenrePerRegion(df):
    #['Action', 'Adventure', 'Fighting', 'Misc', 'Platform', 'Puzzle', 'Racing', 'Role-Playing', 'Shooter', 'Simulation', 'Sports', 'Strategy']
    na_genre_sales = {'Action':0, 'Adventure':0, 'Fighting':0, 'Misc':0, 'Platform':0, 'Puzzle':0, 'Racing':0, 'Role-Playing':0, 'Shooter':0, 'Simulation':0, 'Sports':0, 'Strategy':0}
    eu_genre_sales = {'Action':0, 'Adventure':0, 'Fighting':0, 'Misc':0, 'Platform':0, 'Puzzle':0, 'Racing':0, 'Role-Playing':0, 'Shooter':0, 'Simulation':0, 'Sports':0, 'Strategy':0}
    jp_genre_sales = {'Action':0, 'Adventure':0, 'Fighting':0, 'Misc':0, 'Platform':0, 'Puzzle':0, 'Racing':0, 'Role-Playing':0, 'Shooter':0, 'Simulation':0, 'Sports':0, 'Strategy':0}
    other_genre_sales = {'Action':0, 'Adventure':0, 'Fighting':0, 'Misc':0, 'Platform':0, 'Puzzle':0, 'Racing':0, 'Role-Playing':0, 'Shooter':0, 'Simulation':0, 'Sports':0, 'Strategy':0}
    for i in range(len(df.loc[:, "Rank"])):
        curr_genre = df.loc[i, "Genre"]
        na_genre_sales[curr_genre] += df.loc[i, "NA_Sales"]
        eu_genre_sales[curr_genre] += df.loc[i, "EU_Sales"]
        jp_genre_sales[curr_genre] += df.loc[i, "JP_Sales"]
        other_genre_sales[curr_genre] += df.loc[i, "Other_Sales"]
    # na_top_genre = [max(na_genre_sales, key=na_genre_sales.get)]
    # eu_top_genre = [max(eu_genre_sales, key=eu_genre_sales.get)]
    # jp_top_genre = [max(jp_genre_sales, key=jp_genre_sales.get)]
    # other_top_genre = [max(other_genre_sales, key=other_genre_sales.get)]
    na_top_genre = np.array(sorted(na_genre_sales.items(), key=lambda kv: kv[1]))
    na_top_genre = np.flip(na_top_genre, axis=0)
    eu_top_genre = np.array(sorted(eu_genre_sales.items(), key=lambda kv: kv[1]))
    eu_top_genre = np.flip(eu_top_genre, axis=0)
    jp_top_genre = np.array(sorted(jp_genre_sales.items(), key=lambda kv: kv[1]))
    jp_top_genre = np.flip(jp_top_genre, axis=0)
    other_top_genre = np.array(sorted(other_genre_sales.items(), key=lambda kv: kv[1]))
    other_top_genre = np.flip(other_top_genre, axis=0)
    # print("NA: ",na_top_genre[:,0])
    # print(eu_top_genre)
    # print("JP: ", jp_top_genre)
    # print(other_top_genre)
    df["topGenreNA"] = pd.DataFrame(na_top_genre[:,0])
    df["topGenreNASales"] = pd.DataFrame(na_top_genre[:,1])
    df["topGenreEU"] = pd.DataFrame(eu_top_genre[:,0])
    df["topGenreEUSales"] = pd.DataFrame(eu_top_genre[:,1])
    df["topGenreJP"] = pd.DataFrame(jp_top_genre[:,0])
    df["topGenreJPSales"] = pd.DataFrame(jp_top_genre[:,1])
    df["topGenreOther"] = pd.DataFrame(other_top_genre[:,0])
    df["topGenreOtherSales"] = pd.DataFrame(other_top_genre[:,1])
    return df

def publisherPerGenre(df):
    genres_list = ['Action', 'Adventure', 'Fighting', 'Misc', 'Platform', 'Puzzle', 'Racing', 'Role-Playing', 'Shooter', 'Simulation', 'Sports', 'Strategy']
    publishers = []
    for pub in df.loc[:, "Publisher"]:
        if(pub not in publishers):
            publishers.append(pub)
    zeros = [[0, 0]*len(publishers) for _ in range(len(publishers))]
    #pub_zeros = list(map(list, zip(publishers, zeros)))
    #list(map(list, zip(publishers,np.zeros([len(publishers),2]))))
    #print(pub_zeros)

    genres = {'Action':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Adventure':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Fighting':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Misc':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Platform':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Puzzle':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Racing':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Role-Playing':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Shooter':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Simulation':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Sports':list(map(list, zip(publishers,np.zeros([len(publishers),2])))), 'Strategy':list(map(list, zip(publishers,np.zeros([len(publishers),2]))))}

    for i in range(len(df.loc[:, "Rank"])): #loop through all games
        curr_genre = df.loc[i, "Genre"]
        curr_sale = df.loc[i, "Global_Sales"]
        curr_publisher = df.loc[i, "Publisher"]
        pub_i = publishers.index(curr_publisher)
        #print("DATA POint: ",curr_genre,curr_sale,curr_publisher,pub_i)
        # print(curr_genre, ",", genres[curr_genre][pub_i][0])
        # print("AT PUBlisher: ", pub_i, curr_publisher)
        # print("^^^list^^^", genres[curr_genre][pub_i][1])
        genres[curr_genre][pub_i][1][0] += curr_sale
        genres[curr_genre][pub_i][1][1] += 1
        #print(genres[curr_genre])
    for i in range(len(df.loc[:, "Rank"])):
        curr_genre = df.loc[i, "Genre"]
        curr_publisher = df.loc[i, "Publisher"]
        pub_i = publishers.index(curr_publisher)
        #genres[curr_genre][0][0] = (genres[curr_genre])[0][0] / (genres[curr_genre])[0][1] #sales are proportionate to games made

    for genre in genres_list:
        genres[genre].sort(key = lambda x: x[1][0])
        genres[genre].reverse()
    # for genre in genres_list[:]:
    #     print(genre, np.array(genres[genre]))
    #     print()
    #     print("[][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][][]")
    #     print("")
        df["topPublishersfor"+genre] = pd.DataFrame(np.array(genres[genre])[:,0])
        sales = [x[1][0] for x in (np.array(genres[genre])) ]
        #sales = ((np.array(genres[genre])[:,1]).tolist())
        quantities = [x[1][1] for x in (np.array(genres[genre])) ]
        #print("SALES: " , sales)
        df["topPublishersfor"+genre+"Sales"] = pd.DataFrame(sales)
        df["topPublishersfor"+genre+"Quantity"] = pd.DataFrame(quantities)
    return df

if __name__ == '__main__':
    main()
