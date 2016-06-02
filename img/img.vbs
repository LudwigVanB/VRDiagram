Set oDiag = GetObjectFromId("~lezJUJbJ8P32[Org-Unit Organizational Chart <EN> ]")
Set oDrw = oDiag.Drawing("ro")
Dim h, w
oDrw.SaveAsPicture "C:\Private\16.05 vr\threejs\img\tmp.png", 1, 0, 0, 0, 0, 0, w, h
Print w & " " & h