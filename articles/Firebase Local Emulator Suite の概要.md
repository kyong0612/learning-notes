---
title: "Firebase Local Emulator Suite の概要"
source: "https://firebase.google.com/docs/emulator-suite?hl=ja"
author:
published:
created: 2025-11-19
description: "Firebase Local Emulator Suite は、Cloud Firestore、Realtime Database、Cloud Storage for Firebase、Authentication、Firebase Hosting、Cloud Functions、Pub/Sub、Firebase Extensions などの Firebase サービスのエミュレータを使用してアプリをローカルでビルドおよびテストするデベロッパー向けの高度なツールセットです。充実したユーザー インターフェースを備えており、本番環境のデータに影響を与えることなく、アプリの本稼働やプロトタイピングにかかる時間を短縮できます。"
tags:
  - "Firebase"
  - "Emulator"
  - "ローカル開発"
  - "テスト"
  - "プロトタイピング"
---

# Firebase Local Emulator Suite の概要

## はじめに

Firebase Local Emulator Suite は、Cloud Firestore、Realtime Database、Cloud Storage for Firebase、Authentication、Firebase Hosting、Cloud Functions（ベータ版）、Pub/Sub（ベータ版）、Firebase Extensions（ベータ版）を使用してアプリをローカルでビルドおよびテストするデベロッパー向けの高度なツールセットです。充実したユーザー インターフェースを備えており、アプリの本稼働やプロトタイピングにかかる時間を短縮できます。

Local Emulator Suite を使用したローカル開発は、評価、プロトタイピング、開発、継続的インテグレーションのワークフローに適しています。

## 始める前に

Firebase Local Emulator Suite を使用する前に、Firebase プロダクトと Firebase の開発モデルに慣れておくことをおすすめします。

- ご使用のプラットフォームとプロダクト（[Apple](https://firebase.google.com/docs/ios/setup?hl=ja)、[Android](https://firebase.google.com/docs/android/setup?hl=ja)、[ウェブ](https://firebase.google.com/docs/web/setup?hl=ja)）向けの **Firebase スタートガイド**をお読みください。
- 選択したプラットフォームですぐに実行できるクイックスタート アプリをダウンロードし、コードを確認して実行します。FriendlyEats クイックスタート アプリ（[iOS](https://github.com/firebase/friendlyeats-ios)、[Android](https://github.com/firebase/friendlyeats-android)、[ウェブ](https://github.com/firebase/friendlyeats-web)）をおすすめします。

## Firebase Local Emulator Suite とは

Firebase Local Emulator Suite は、Firebase サービスの動作を正確に再現するようにビルドされた個々のサービス エミュレータで構成されています。つまり、本番環境のデータに影響を与えることなく、アプリをこれらのエミュレータに直接接続して統合テストや QA を実行できます。

たとえば、アプリを Cloud Firestore エミュレータに接続して、テスト中にドキュメントを安全に読み取り / 書き込みできます。この書き込みにより、Cloud Functions エミュレータで関数がトリガーされることがあります。ただし、エミュレータが利用できない場合や構成されていない場合でも、アプリは引き続き本番環境の Firebase サービスと通信します。

**注:** これらのエミュレータを Firebase サービスの「自己ホスト」バージョンとして使用しないでください。パフォーマンスやセキュリティではなく精度を重視して設計されているため、本番環境での使用には適していません。

## ローカル ワークフローでの Emulator Suite

プロトタイプとテストのワークフローでは、次の方法で Local Emulator Suite を使用できます。

### 単体テスト

Firebase Test SDK を使用すると、mocha テストランナーを使用して Node.js で単体テストを作成できます。Test SDK には、セキュリティ ルールの読み込み、テスト間のローカル データベースのフラッシュ、エミュレータとの同期インタラクションの管理を行うための便利なメソッドがいくつか用意されています。アプリのロジックに依存しないデータベース インタラクションの簡単なテストを作成する場合に最適です。

### 統合テスト

Emulator Suite 内の各プロダクト エミュレータは、本番環境の Firebase サービスと同じように、SDK 呼び出しと REST API 呼び出しに応答します。そのため、独自のテストツールを使用して、Local Emulator Suite をバックエンドとして使用する自己完結型の統合テストを作成できます。

### 手動テスト

実行中のアプリケーションを Local Emulator Suite に接続して、Firebase アプリを手動でテストできます。本番環境データは危険にさられることなく、テスト プロジェクトの構成は不要です。

### プロダクト評価

安全なローカル環境で Firebase Extensions のインストールと管理を行うことで、請求額を最小限に抑えながらその機能を理解できます。

## サポートされている Firebase の機能とプラットフォーム

Firebase Local Emulator Suite を使用すると、相互運用可能な方法で Google のコアプロダクトでコードをテストできます。Cloud Functions エミュレータは、Cloud Firestore、Realtime Database、Cloud Storage for Firebase、Authentication、Pub/Sub によってトリガーされる HTTP 関数、呼び出し可能関数、バックグラウンド関数をサポートしています。Cloud Firestore、Realtime Database、Cloud Storage for Firebase のエミュレータには Firebase Security Rules エミュレーションが組み込まれています。

### プラットフォーム別サポート状況

| | **Cloud Firestore** | **Realtime Database** | **Cloud Storage for Firebase** | **Authentication** | **Cloud Functions** | **Cloud Pub/Sub** | **拡張機能** |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **Android SDK** | ✅ | ✅ | ✅ | ✅ | ✅ | なし | なし |
| **iOS SDK** | ✅ | ✅ | ✅ | ✅ | ✅ | なし | なし |
| **Web SDK** | ✅ | ✅ | ✅ | ✅ | ✅ | なし | なし |
| **Node.js Admin SDK** | ✅ | ✅ | ✅ | ✅ | なし | ✅ | なし |

## プロトタイピングとテスト用のその他のツール

Emulator Suite には、他のプロトタイプやテストツールが追加されています。

### Cloud Functions テストツール

Firebase CLI 環境では、関数をプロトタイプ化してテストするためのいくつかの方法が用意されています。

- **Cloud Functions エミュレータ**: Emulator Suite の一部である Cloud Functions エミュレータ。このエミュレータは、Firestore エミュレータや Realtime Database エミュレータのローカル、ライブデータ、セキュリティ ルールと相互運用できます。
- **Cloud Functions シェル**: 対話型の反復型関数のプロトタイピングと開発を可能にします。このシェルは、開発用に REPL スタイルのインターフェースを備えた Cloud Functions エミュレータを使用します。Cloud Firestore エミュレータまたは Realtime Database エミュレータとの統合は実現されていません。シェルを使用してデータをモックし、Local Emulator Suite が現在サポートしていないプロダクト（アナリティクス、Remote Config、Crashlytics）とのやり取りをシミュレートする関数呼び出しを実行します。
- **Cloud Functions 用の Firebase Test SDK**: 関数開発用の Mocha フレームワークを備えた Node.js。実際、Cloud Functions Test SDK は Cloud Functions シェルの上に自動化機能を提供します。

### セキュリティ ルールのテストツール

Emulator Suite は、セキュリティ ルールのテストに推奨されるツールセットですが、以下を使用することもできます。

- **ルール プレイグラウンド**: Firebase コンソールの一部であるルール プレイグラウンド。ルール プレイグラウンドを使用すると、セキュリティ ルールの設計を簡単に始めることができます。

## 次のステップ

- データベースと Cloud Functions のプロトタイプをオフラインで作成する方法について説明している Local Emulator Suite のチュートリアルを[始める](https://firebase.google.com/docs/emulator-suite/connect_and_prototype?hl=ja)。
- [Local Emulator Suite のインストールと構成](https://firebase.google.com/docs/emulator-suite/install_and_configure?hl=ja)方法をご確認ください。

## 重要な注意事項

- エミュレータは本番環境のデータに影響を与えませんが、エミュレータが利用できない場合や構成されていない場合でも、アプリは引き続き本番環境の Firebase サービスと通信します。
- これらのエミュレータを Firebase サービスの「自己ホスト」バージョンとして使用しないでください。パフォーマンスやセキュリティではなく精度を重視して設計されているため、本番環境での使用には適していません。
