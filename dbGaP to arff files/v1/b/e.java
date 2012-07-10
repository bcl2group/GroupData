package b;

import java.util.ArrayList;

public final class e
  implements Runnable
{
  private String a;
  private StringBuffer b;
  private int c;
  private int d;
  private int e;
  private int f;
  private ArrayList g;
  private Integer[][] h;

  public e(String paramString, int paramInt1, int paramInt2, int paramInt3, int paramInt4, int paramInt5, Integer[][] paramArrayOfInteger, ArrayList paramArrayList1, ArrayList paramArrayList2)
  {
    this.a = paramString;
    this.c = paramInt1;
    this.d = 0;
    this.e = paramInt3;
    this.f = paramInt4;
    this.h = paramArrayOfInteger;
    this.g = paramArrayList2;
    this.b = new StringBuffer();
  }

  public final void run()
  {
    String[] arrayOfString = this.a.split(" ");
    for (int i = 0; i < this.c; i++)
    {
      str2 = arrayOfString[((Integer)this.g.get(i)).intValue()].trim();
      a(str2, i);
    }
    String str1 = arrayOfString[this.e];
    a(str1, this.c + this.d);
    String str2 = arrayOfString[this.f];
    a(str2, this.c + this.d + 1);
    this.b.deleteCharAt(this.b.length() - 1);
    this.b.append('\n');
  }

  public final StringBuffer a()
  {
    return this.b;
  }

  private void a(String paramString, int paramInt)
  {
    if ((paramString.equals("NA")) || (paramString.equals("?")))
    {
      this.b.append("?,");
      return;
    }
    this.b.append(paramString);
    this.b.append(',');
    for (int i = 0; i < 3; i++)
      try
      {
        j = Integer.parseInt(paramString);
        if (this.h[paramInt][i].intValue() == j)
          return;
        if (this.h[paramInt][i].intValue() != 2147483647)
          continue;
        this.h[paramInt][i] = Integer.valueOf(j);
        return;
      }
      catch (NumberFormatException localNumberFormatException)
      {
        int j;
        if (paramString.contains(".dup"))
        {
          j = Integer.parseInt(paramString = paramString.substring(0, paramString.indexOf(".dup")));
          if (this.h[paramInt][i].intValue() == j)
            return;
          if (this.h[paramInt][i].intValue() != 2147483647)
            continue;
          this.h[paramInt][i] = Integer.valueOf(j);
          return;
        }
        b.a(Integer.valueOf(paramInt), paramString);
        return;
      }
  }
}

/* Location:           C:\Downloads\Project\MyEclipse\pipeline.jar
 * Qualified Name:     b.e
 * JD-Core Version:    0.6.0
 */