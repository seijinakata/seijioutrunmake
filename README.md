youtubeのFamTrinliさん、Akichonさんの動画のoutrunを組んでみました。
方向キーで移動、aが前方向のアクセル
windowschrome,Edgeのプロパティのリンク先の最後を
 --allow-file-access-from-filesを付け加えてください。
 色で当たり判定をしているので、getImageDataにエラーが起こります。
 コードは、当たり判定はyは画面の一番下、xは中心を自機の位置とし、
道路を作画した後、道路の色を取れなかったら道路から出ているとし、
移動前に戻します。作画は一番遠い位置から作画をし見えない部分は上書きします。
