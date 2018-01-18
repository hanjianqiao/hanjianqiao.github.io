---
layout: post
title:  "Welcome to Jekyll!"
date:   2018-01-18 13:16:01 +0800
categories: jekyll
tags: template
---

Use Pi 3 as Wifi Hotspot




## Environment
Hardware: Pi 3
System: https://www.raspberrypi.org/downloads/raspbian/ downloads `RASPBIAN STRETCH LITE` with date after 2017-11-29

Enable ssh: ref. https://www.raspberrypi.org/documentation/remote-access/ssh/


## Follow me

### Login on Pi3

1.

```
sudo apt update
sudo apt -y install hostapd
sudo apt -y install dnsmasq
```

2.

Edit `/etc/dhcpcd.conf`, add `denyinterfaces wlan0` to the bottom.

3.

Replace whole `/etc/network/interfaces` to following, you may do a backup.

```
allow-hotplug wlan0  
iface wlan0 inet static  
    address 172.24.1.1
    netmask 255.255.255.0
    network 172.24.1.0
    broadcast 172.24.1.255
```

4.

Create file `/etc/hostapd/hostapd.conf`

```
# This is the name of the WiFi interface we configured above
interface=wlan0

# Use the nl80211 driver with the brcmfmac driver
driver=nl80211

# This is the name of the network
ssid=Pi3-AP

# Use the 2.4GHz band
hw_mode=g

# Use channel 6
channel=6

# Enable 802.11n
ieee80211n=1

# Enable WMM
wmm_enabled=1

# Enable 40MHz channels with 20ns guard interval
ht_capab=[HT40][SHORT-GI-20][DSSS_CCK-40]

# Accept all MAC addresses
macaddr_acl=0

# Use WPA authentication
auth_algs=1

# Require clients to know the network name
ignore_broadcast_ssid=0

# Use WPA2
wpa=2

# Use a pre-shared key
wpa_key_mgmt=WPA-PSK

# The network passphrase
wpa_passphrase=raspberry

# Use AES, instead of TKIP
rsn_pairwise=CCMP
```

5.

Add `DAEMON_CONF="/etc/hostapd/hostapd.conf"` to end of `/etc/default/hostapd`

6.

```
sudo mv /etc/dnsmasq.conf /etc/dnsmasq.conf.orig
```

Create `/etc/dnsmasq.conf` with content:

```
interface=wlan0      # Use interface wlan0  
listen-address=172.24.1.1 # Explicitly specify the address to listen on  
bind-interfaces      # Bind to the interface to make sure we aren't sending things elsewhere  
server=8.8.8.8       # Forward DNS requests to Google DNS  
domain-needed        # Don't forward short names  
bogus-priv           # Never forward addresses in the non-routed address spaces.  
dhcp-range=172.24.1.50,172.24.1.150,12h # Assign IP addresses between 172.24.1.50 and 172.24.1.150 with a 12 hour lease time  
```

7.

Reboot
