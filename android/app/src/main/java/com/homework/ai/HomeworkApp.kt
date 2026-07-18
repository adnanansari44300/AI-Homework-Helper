package com.homework.ai

import android.app.Application
import com.google.android.gms.ads.MobileAds
import dagger.hilt.android.HiltAndroidApp

@HiltAndroidApp
class HomeworkApp : Application() {
    override fun onCreate() {
        super.onCreate()
        // Initialize AdMob on app startup
        MobileAds.initialize(this) {}
    }
}
